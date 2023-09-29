// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import 'src/Channel.sol';

contract ChannelFactory {
	struct ChannelInfo {
		address channelAddress;
		string title;
		address owner;
		bool deleted;
	}

	ChannelInfo[] public channels;
	mapping(address => uint256) public channelIndexByAddress;
	mapping(address => ChannelInfo[]) public channelsByOwner;

	event ChannelCreated(address indexed channelAddress, address indexed owner);
	event ChannelUpdated(address indexed channelAddress, address indexed owner);

	function getChannels() external view returns (ChannelInfo[] memory) {
		return channels;
	}

	function getChannelsByOwner(address owner) external view returns (ChannelInfo[] memory) {
		return channelsByOwner[owner];
	}

	function getChannelInfo(address channelAddress) external view returns (ChannelInfo memory) {
		return channels[channelIndexByAddress[channelAddress]];
	}

	function createChannel(Channel.ChannelParams memory channel) external returns (address) {
		channel.owner = msg.sender;

		Channel newChannel = new Channel(channel, address(this));

		// Map the channel address to the index in the channels array
		channelIndexByAddress[address(newChannel)] = channels.length;

		// Add the new channel to the channels array
		channels.push(ChannelInfo(address(newChannel), channel.title, channel.owner, false));

		// Map the channel owner to a list of channels they own
		channelsByOwner[channel.owner].push(
			ChannelInfo(address(newChannel), channel.title, channel.owner, false)
		);

		emit ChannelCreated(address(newChannel), channel.owner);

		return address(newChannel);
	}

	// Called by a channel to keep the factory up to date
	function updateChannel(ChannelInfo memory channelInfo) external {
		require(msg.sender == channelInfo.channelAddress, 'can only be updated by a channel');

		uint256 channelIndex = channelIndexByAddress[channelInfo.channelAddress];

		// Update the channel in the channels array
		channels[channelIndex] = channelInfo;

		address owner = channels[channelIndex].owner;

		// Update the channel in the channelsByOwner mapping
		for (uint256 i = 0; i < channelsByOwner[owner].length; i++) {
			if (channelsByOwner[owner][i].channelAddress == channelInfo.channelAddress) {
				channelsByOwner[owner][i] = channelInfo;
				break;
			}
		}

		emit ChannelUpdated(channelInfo.channelAddress, channelInfo.owner);
	}
}
