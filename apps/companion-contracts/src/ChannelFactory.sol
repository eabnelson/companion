// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import 'src/Channel.sol';

contract ChannelFactory {
	struct ChannelInfo {
		address channelAddress;
		string title;
		address owner;
	}

	ChannelInfo[] public channels;

	mapping(address => ChannelInfo[]) public channelsByOwner;

	event ChannelCreated(address indexed channelAddress, string title, address indexed owner);

	function createChannel(Channel.ChannelParams memory channel) external returns (address) {
		_checkChannel(channel);

		channel.owner = msg.sender;

		Channel newChannel = new Channel(channel);

		channels.push(ChannelInfo(address(newChannel), channel.title, channel.owner));
		channelsByOwner[channel.owner].push(
			ChannelInfo(address(newChannel), channel.title, channel.owner)
		);

		emit ChannelCreated(address(newChannel), channel.title, channel.owner);

		return address(newChannel);
	}

	function getChannels() external view returns (ChannelInfo[] memory) {
		return channels;
	}

	function getChannelsByOwner(address owner) external view returns (ChannelInfo[] memory) {
		return channelsByOwner[owner];
	}

	function _checkChannel(Channel.ChannelParams memory channel) private pure {
		require(bytes(channel.title).length > 0, 'channel title is required');
		require(bytes(channel.symbol).length > 0, 'channel symbol is required');
		require(bytes(channel.description).length > 0, 'channel description is required');
	}
}
