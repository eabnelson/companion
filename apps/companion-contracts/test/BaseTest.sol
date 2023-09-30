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
	string title = 'Founders';
	string channelLink = 'https://www.founderspodcast.com/';
	string language = 'en';
	string channelDescription =
		"Learn from history's greatest entrepreneurs. Every week I read a biography of an entrepreneur and find ideas you can use in your work.";
	string copyright = 'Copyright 2023 Founders, LLC';
	string imageUrl =
		'https://image.simplecastcdn.com/images/57933a1d-c5a9-4040-9aca-e766ae2ec0eb/721c2dd0-f766-4405-a701-dcd9179d4a5b/3000x3000/1495013501artwork.jpg?aid=rss_feed';

	// Example post params
	string guid = '31144c21-6dd0-4d4f-9bde-2f940b29ebfc';
	string postTitle = '#314 Paul Graham (How To Do Great Work)';
	string pubDate = 'Mon, 31 Jul 2023 04:03:04 +0000';
	string authorName = 'David Senra';
	string postDescription =
		'What I learned from reading <a href="http://www.paulgraham.com/greatwork.html">How To Do Great Work</a> by Paul Graham.</p>';
	string content =
		'https://cdn.simplecast.com/audio/57933a1d-c5a9-4040-9aca-e766ae2ec0eb/episodes/79c87df2-dbef-4642-859b-50107ec42521/audio/db76c81b-703d-475b-8b63-ad8fc1e0d550/default_tc.mp3?aid=rss_feed&feed=3hnxp7yk';

	Channel.ChannelParams public defaultChannelParams =
		setChannelParams(title, channelLink, language, channelDescription, copyright, imageUrl);

	Channel.Post public defaultPostParams =
		setPostParams(guid, postTitle, pubDate, authorName, postDescription, content);

	function setUp() public {
		userA = hevm.addr(userAPrivateKey);
		userB = hevm.addr(userBPrivateKey);

		channelFactory = new ChannelFactory();

		hevm.prank(userA);
		defaultChannel = Channel(channelFactory.createChannel(defaultChannelParams));
	}

	function setChannelParams(
		string memory _title,
		string memory _channelLink,
		string memory _language,
		string memory _description,
		string memory _copyright,
		string memory _imageUrl
	) internal pure returns (Channel.ChannelParams memory) {
		return
			Channel.ChannelParams({
				owner: address(0),
				title: _title,
				link: _channelLink,
				language: _language,
				description: _description,
				copyright: _copyright,
				imageUrl: _imageUrl,
				deleted: false
			});
	}

	function setPostParams(
		string memory _guid,
		string memory _title,
		string memory _pubDate,
		string memory _authorName,
		string memory _description,
		string memory _content
	) internal pure returns (Channel.Post memory) {
		return
			Channel.Post({
				id: 0,
				author: address(0),
				guid: _guid,
				title: _title,
				pubDate: _pubDate,
				authorName: _authorName,
				description: _description,
				content: _content,
				deleted: false
			});
	}
}
