// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './BaseTest.sol';

contract ChannelFactoryTest is BaseTest {
	function testSetup() external {
		ChannelFactory.ChannelInfo[] memory currentChannels = channelFactory.getChannels();
		assertEq(currentChannels.length, 1, 'channels should have 1 channel');

		ChannelFactory.ChannelInfo[] memory currentChannelsByOwner = channelFactory
			.getChannelsByOwner(userA);
		assertEq(currentChannelsByOwner.length, 1, 'owner should have 1 channel');
	}

	function testCreateChannel() external {
		string memory title = 'New Channel';
		string memory link = 'https://example.com';
		string memory language = '';
		string memory description = 'New Channel Description';
		string memory copyright = '';
		string memory imageUrl = 'https://example.com/image.png';

		Channel.ChannelParams memory newChannelParams = setChannelParams(
			title,
			link,
			language,
			description,
			copyright,
			imageUrl
		);

		// Attempt to create channel without symbol
		hevm.prank(userA);
		hevm.expectRevert(abi.encodePacked('language is required'));
		channelFactory.createChannel(newChannelParams);

		newChannelParams.language = 'en';

		ChannelFactory.ChannelInfo[] memory currentChannels = channelFactory.getChannels();
		uint256 currentChannelsLength = currentChannels.length;

		// Create channel
		hevm.prank(userA);
		address newChannel = channelFactory.createChannel(newChannelParams);

		ChannelFactory.ChannelInfo[] memory newChannels = channelFactory.getChannels();
		uint256 newChannelsLength = newChannels.length;

		assertEq(
			newChannelsLength,
			currentChannelsLength + 1,
			'number of channels should be incremented'
		);

		ChannelFactory.ChannelInfo[] memory newChannelsByOwner = channelFactory.getChannelsByOwner(
			userA
		);

		uint256 newChannelsByOwnerLength = newChannelsByOwner.length;

		assertEq(newChannelsByOwnerLength, 2, 'owner should have 2 channels');
		assertEq(
			newChannelsByOwner[newChannelsByOwnerLength - 1].channelAddress,
			newChannel,
			"owner's channel should exist"
		);
	}
}
