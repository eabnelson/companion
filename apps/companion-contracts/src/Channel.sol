// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Channel {
	address public owner;
	string public title;
	string public symbol;
	string public description;

	struct ChannelParams {
		address owner;
		string title;
		string symbol;
		string description;
	}

	struct Post {
		uint256 id;
		address author;
		string authorName;
		string title;
		string link;
		string description;
		string content;
		bool deleted;
	}

	Post[] public posts; // All posts
	mapping(uint256 => Post) public postsById; // id => Post
	mapping(string => Post) public postsByTitle; // title => Post

	event OwnerUpdated(address indexed newOwner);
	event PostCreated(uint256 indexed postId, string title, address author);
	event PostUpdated(uint256 indexed postId, string title, address author);
	event PostDeleted(uint256 indexed postId, string title, address author);

	constructor(ChannelParams memory channel) {
		owner = channel.owner;
		title = channel.title;
		symbol = channel.symbol;
		description = channel.description;
	}

	/*
        External functions
    */

	function udpateOwner(address newOwner) external {
		require(msg.sender == owner, 'not current owner');

		owner = newOwner;

		emit OwnerUpdated(owner);
	}

	function createPost(Post memory post) external returns (uint256, string memory) {
		require(msg.sender == owner, 'only the owner can create a post');

		return _createPost(post);
	}

	function updatePost(Post memory post) external returns (uint256, string memory) {
		require(msg.sender == owner, 'only the owner can update a post');

		return _updatePost(post);
	}

	function deletePost(uint256 postId) external returns (uint256, string memory) {
		require(msg.sender == owner, 'only the owner can delete a post');

		return _deletePost(postId);
	}

	function getAllPosts() external view returns (Post[] memory) {
		return posts;
	}

	function getPostById(uint256 postId) external view returns (Post memory) {
		return postsById[postId];
	}

	function getPostByTitle(string memory postTitle) external view returns (Post memory) {
		return postsByTitle[postTitle];
	}

	function queryChannel() external view returns (ChannelParams memory, Post[] memory) {
		return (
			ChannelParams({ owner: owner, title: title, symbol: symbol, description: description }),
			posts
		);
	}

	/*
        Internal functions
    */

	function _createPost(Post memory post) internal returns (uint256, string memory) {
		require(post.id == 0, 'post already exists');

		_checkPost(post);

		post.id = posts.length + 1;
		post.author = msg.sender;

		posts.push(post);
		postsById[post.id] = post;
		postsByTitle[post.title] = post;
		emit PostCreated(post.id, post.title, post.author);

		return (post.id, post.title);
	}

	function _updatePost(Post memory postUpdates) internal returns (uint256, string memory) {
		Post storage post = postsById[postUpdates.id];
		require(post.id > 0, 'post does not exist');

		_checkPost(postUpdates);

		post.authorName = postUpdates.authorName;
		post.title = postUpdates.title;
		post.link = postUpdates.link;
		post.description = postUpdates.description;
		post.content = postUpdates.content;

		emit PostUpdated(post.id, post.title, post.author);

		return (post.id, post.title);
	}

	function _deletePost(uint256 postId) internal returns (uint256, string memory) {
		Post storage post = postsById[postId];
		require(post.id > 0, 'post does not exist');
		require(!post.deleted, 'post already deleted');

		post.deleted = true;

		emit PostDeleted(post.id, post.title, post.author);

		return (post.id, post.title);
	}

	// Check the required fields for a post
	function _checkPost(Post memory post) internal pure {
		require(bytes(post.authorName).length > 0, 'author name is required');
		require(bytes(post.title).length > 0, 'title is required');
		require(bytes(post.link).length > 0, 'link is required');
		require(bytes(post.description).length > 0, 'description is required');
		require(bytes(post.content).length > 0, 'content is required');
	}
}
