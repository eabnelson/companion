// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './BaseTest.sol';

contract ChannelFactoryTest is BaseTest {
	function testSetup() external {
		address[] memory currentChannels = channelFactory.getChannels();
		assertEq(currentChannels.length, 1, 'channels should have 1 channel');

		address firstChannel = channelFactory.getChannelByTitle(title);
		assertEq(firstChannel, currentChannels[0], 'channel should exist');

		address[] memory currentChannelsByOwner = channelFactory.getChannelsByOwner(userA);
		assertEq(firstChannel, currentChannelsByOwner[0], "owner's channel should exist");
		assertEq(currentChannelsByOwner.length, 1, 'owner should have 1 channel');
	}

	function testCreateChannel() external {
		string memory title = 'New Channel';
		string memory symbol;
		string memory description = 'New Channel Description';

		Channel.ChannelParams memory newChannelParams = setChannelParams(
			title,
			symbol,
			description
		);

		// Attempt to create channel with existing title
		hevm.prank(userA);
		hevm.expectRevert(abi.encodePacked('channel title already exists'));
		channelFactory.createChannel(defaultChannelParams);

		// Attempt to create channel without symbol
		hevm.prank(userA);
		hevm.expectRevert(abi.encodePacked('channel symbol is required'));
		channelFactory.createChannel(newChannelParams);

		newChannelParams.symbol = 'NCS';

		address[] memory currentChannels = channelFactory.getChannels();
		uint256 currentChannelsLength = currentChannels.length;

		// Create channel
		hevm.prank(userA);
		address newChannel = channelFactory.createChannel(newChannelParams);

		address[] memory newChannels = channelFactory.getChannels();
		uint256 newChannelsLength = newChannels.length;

		assertEq(
			newChannelsLength,
			currentChannelsLength + 1,
			'number of channels should be incremented'
		);

		address newChannelByTitle = channelFactory.getChannelByTitle(newChannelParams.title);
		assertEq(newChannelByTitle, newChannel, 'channel should exist by title');

		address[] memory newChannelsByOwner = channelFactory.getChannelsByOwner(userA);

		uint256 newChannelsByOwnerLength = newChannelsByOwner.length;

		assertEq(newChannelsByOwnerLength, 2, 'owner should have 2 channels');
		assertEq(
			newChannelsByOwner[newChannelsByOwnerLength - 1],
			newChannel,
			"owner's channel should exist"
		);
	}
}
