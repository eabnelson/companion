// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './utils/DSTestPlus.sol';
import 'lib/forge-std/src/console2.sol';

import 'src/Channel.sol';
import 'src/ChannelFactory.sol';

contract BaseTest is DSTestPlus {
	address public userA;
	uint256 public userAPrivateKey = 0xBEEF;

	address public userB;
	uint256 public userBPrivateKey = 0xDEAD;

	Channel public defaultChannel;
	ChannelFactory public channelFactory;

	// Example channel params
	string title = 'Channel Title';
	string symbol = 'DCT';
	string description = 'default channel for testing';

	// Example post params
	string authorName = 'Arthur Nome';
	string postTitle = 'The First Post';
	string link = 'https://channelurl.pod/channeladdress';
	string postDescription = 'This is the first post example';
	string content = 'https://channelurl.pod/audio/channeladdress/episode.mp3';

	Channel.ChannelParams public defaultChannelParams =
		setChannelParams(title, symbol, description);

	Channel.Post public defaultPostParams =
		setPostParams(authorName, postTitle, link, postDescription, content);

	function setUp() public {
		userA = hevm.addr(userAPrivateKey);
		userB = hevm.addr(userBPrivateKey);

		channelFactory = new ChannelFactory();

		hevm.prank(userA);
		defaultChannel = Channel(channelFactory.createChannel(defaultChannelParams));
	}

	function setChannelParams(
		string memory _title,
		string memory _symbol,
		string memory _description
	) internal pure returns (Channel.ChannelParams memory) {
		return
			Channel.ChannelParams({
				owner: address(0),
				title: _title,
				symbol: _symbol,
				description: _description
			});
	}

	function setPostParams(
		string memory _authorName,
		string memory _title,
		string memory _link,
		string memory _description,
		string memory _content
	) internal pure returns (Channel.Post memory) {
		return
			Channel.Post({
				id: 0,
				author: address(0),
				authorName: _authorName,
				title: _title,
				link: _link,
				description: _description,
				content: _content,
				deleted: false
			});
	}
}
