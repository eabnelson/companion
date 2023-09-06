// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import 'src/Channel.sol';

contract ChannelFactory {
	address[] public channels;

	mapping(string => address) channelByTitle; // title => Channel
	mapping(address => address[]) channelsByOwner; // owner => Channels

	event ChannelCreated(address indexed channelAddress, string title, address indexed owner);

	function createChannel(Channel.ChannelParams memory channel) external returns (address) {
		_checkChannel(channel);

		channel.owner = msg.sender;

		Channel newChannel = new Channel(channel);

		channels.push(address(newChannel));
		channelByTitle[channel.title] = address(newChannel);
		channelsByOwner[channel.owner].push(address(newChannel));

		emit ChannelCreated(address(newChannel), channel.title, channel.owner);

		return address(newChannel);
	}

	function getChannels() external view returns (address[] memory) {
		return channels;
	}

	function getChannelByTitle(string memory title) external view returns (address) {
		return channelByTitle[title];
	}

	function getChannelsByOwner(address owner) external view returns (address[] memory) {
		return channelsByOwner[owner];
	}

	function _checkChannel(Channel.ChannelParams memory channel) private view {
		require(channelByTitle[channel.title] == address(0), 'channel title already exists');
		require(bytes(channel.title).length > 0, 'channel title is required');
		require(bytes(channel.symbol).length > 0, 'channel symbol is required');
		require(bytes(channel.description).length > 0, 'channel description is required');
	}
}
