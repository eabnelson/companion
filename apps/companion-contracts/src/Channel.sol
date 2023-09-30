// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import 'src/ChannelFactory.sol';

contract Channel {
	ChannelFactory public immutable factory;

	struct ChannelParams {
		address owner;
		string title;
		string link;
		string language;
		string description;
		string copyright;
		string imageUrl;
		bool deleted;
	}

	struct Post {
		uint256 id;
		address author;
		string guid;
		string title;
		string pubDate;
		string authorName;
		string description;
		string content;
		bool deleted;
	}

	ChannelParams public channel;
	Post[] public posts; // All posts
	mapping(uint256 => Post) public postsById; // id => Post

	event OwnerUpdated(address indexed newOwner);
	event ChannelUpdated(address indexed owner);
	event PostCreated(uint256 indexed postId, string title, address author);
	event PostUpdated(uint256 indexed postId, string title, address author);
	event PostDeleted(uint256 indexed postId, string title, address author);

	constructor(ChannelParams memory channelParams, address channelFactory) {
		_checkChannel(channelParams);

		channel = channelParams;
		factory = ChannelFactory(channelFactory);
	}

	/*
        External functions
    */

	function udpateOwner(address newOwner) external {
		require(msg.sender == channel.owner, 'not current channel owner');

		channel.owner = newOwner;

		emit OwnerUpdated(channel.owner);
	}

	function updateChannel(ChannelParams memory channelParams) external {
		require(msg.sender == channel.owner, 'not current channel owner');

		return _updateChannel(channelParams);
	}

	function createPost(Post memory post) external returns (uint256, string memory) {
		require(msg.sender == channel.owner, 'only the channel owner can create a post');

		return _createPost(post);
	}

	function updatePost(Post memory post) external returns (uint256, string memory) {
		require(msg.sender == channel.owner, 'only the channel owner can update a post');

		return _updatePost(post);
	}

	function deletePost(uint256 postId) external returns (uint256, string memory) {
		require(msg.sender == channel.owner, 'only the channel owner can delete a post');

		return _deletePost(postId);
	}

	function getAllPosts() external view returns (Post[] memory) {
		return posts;
	}

	function getPostById(uint256 postId) external view returns (Post memory) {
		return postsById[postId];
	}

	function getPostByIndex(uint256 index) public view returns (Channel.Post memory) {
		return posts[index];
	}

	function queryChannel() external view returns (ChannelParams memory, Post[] memory) {
		return (channel, posts);
	}

	/*
        Internal functions
    */

	function _updateChannel(ChannelParams memory channelParams) internal {
		_checkChannel(channelParams);

		// if title, owner or deleted status changed, update the channel in the factory
		if (
			keccak256(abi.encodePacked(channelParams.title)) !=
			keccak256(abi.encodePacked(channel.title)) ||
			channelParams.owner != channel.owner ||
			channelParams.deleted != channel.deleted
		) {
			// Keep the channel details updated in the ChannelFactory
			factory.updateChannel(
				ChannelFactory.ChannelInfo({
					channelAddress: address(this), // address can't change
					title: channelParams.title,
					imageUrl: channelParams.imageUrl,
					owner: channelParams.owner,
					deleted: channelParams.deleted
				})
			);
		}

		channel = channelParams;

		emit ChannelUpdated(channel.owner);
	}

	function _createPost(Post memory post) internal returns (uint256, string memory) {
		require(post.id == 0, 'post already exists');

		_checkPost(post);

		post.id = posts.length + 1;
		post.author = msg.sender;

		posts.push(post);
		postsById[post.id] = post;
		emit PostCreated(post.id, post.title, post.author);

		return (post.id, post.title);
	}

	function _updatePost(Post memory postUpdates) internal returns (uint256, string memory) {
		require(postUpdates.id > 0 && postUpdates.id <= posts.length, 'post does not exist');

		_checkPost(postUpdates);

		// Update the post in the posts array
		posts[postUpdates.id - 1] = postUpdates;

		// Update the post in the postsById mapping
		postsById[postUpdates.id] = postUpdates;

		emit PostUpdated(postUpdates.id, postUpdates.title, postUpdates.author);

		return (postUpdates.id, postUpdates.title);
	}

	function _deletePost(uint256 postId) internal returns (uint256, string memory) {
		Post storage post = postsById[postId];
		require(post.id > 0, 'post does not exist');
		require(!post.deleted, 'post already deleted');

		// Set post in postsById mapping as deleted
		post.deleted = true;

		// Update the post in the posts array
		posts[postId - 1] = post;

		emit PostDeleted(post.id, post.title, post.author);

		return (post.id, post.title);
	}

	// Check the required fields for a post
	function _checkPost(Post memory post) internal pure {
		require(bytes(post.guid).length > 0, 'guid is required');
		require(bytes(post.title).length > 0, 'title is required');
		require(bytes(post.pubDate).length > 0, 'pubDate is required');
		require(bytes(post.authorName).length > 0, 'author name is required');
		require(bytes(post.description).length > 0, 'description is required');
		require(bytes(post.content).length > 0, 'content is required');
	}

	// Check the required fields for a channel
	function _checkChannel(ChannelParams memory channelParams) private pure {
		require(channelParams.owner != address(0), 'owner is required');
		require(bytes(channelParams.title).length > 0, 'title is required');
		require(bytes(channelParams.link).length > 0, 'link is required');
		require(bytes(channelParams.imageUrl).length > 0, 'imageUrl is required');
		require(bytes(channelParams.language).length > 0, 'language is required');
		require(bytes(channelParams.description).length > 0, 'description is required');
	}
}
