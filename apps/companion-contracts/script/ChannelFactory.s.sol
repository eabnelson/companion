// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { Script, console2 } from 'forge-std/Script.sol';

import 'src/Channel.sol';
import 'src/ChannelFactory.sol';

contract ChannelFactoryScript is Script {
	ChannelFactory public channelFactory;
	Channel public channel;

	// First channel params
	string title = 'Companion 1.0';
	string symbol = 'CPN';
	string description = 'first companion channel deployed on base goerli';

	// First post params
	string authorName = 'Based Companion';
	string postTitle = 'Onchain RSS';
	string link = 'https://channelurl.pod/channeladdress';
	string postDescription = 'This is the first post on the companion rss channel';
	string content = 'https://channelurl.pod/audio/channeladdress/episode.mp3';

	Channel.ChannelParams public channelParams = setChannelParams(title, symbol, description);

	Channel.Post public postParams =
		setPostParams(authorName, postTitle, link, postDescription, content);

	function setUp() public {}

	function run() public {
		uint256 deployerPK = vm.envUint('PRIVATE_KEY');

		address deployer = vm.addr(deployerPK);

		vm.startBroadcast(deployer);

		channelFactory = new ChannelFactory();

		channel = Channel(channelFactory.createChannel(channelParams));

		channel.createPost(postParams);

		vm.stopBroadcast();
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
