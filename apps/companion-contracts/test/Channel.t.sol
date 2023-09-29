// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './BaseTest.sol';

contract ChannelTest is BaseTest {
	function testChannelSetup() external {
		address factory = address(defaultChannel.factory());
		(
			address currentOwner,
			string memory currentTitle,
			,
			,
			string memory currentDescription,
			,
			,
			bool deleted
		) = defaultChannel.channel();

		assertEq(deleted, false, 'channel should not be deleted');
		assertEq(currentOwner, userA, 'owner incorrect');
		assertEq(factory, address(channelFactory), 'factory incorrect');
		assertEq(currentTitle, title, 'title incorrect');
		assertEq(currentDescription, channelDescription, 'description incorrect');

		Channel.Post[] memory currentPosts = defaultChannel.getAllPosts();
		assertEq(currentPosts.length, 0, 'posts should be empty');
	}

	function testUpdateOwner() external {
		(address currentOwner, , , , , , , ) = defaultChannel.channel();

		// Attempt to update owner from non-owner
		hevm.prank(userB);
		hevm.expectRevert(abi.encodePacked('not current channel owner'));
		defaultChannel.udpateOwner(userB);

		assertEq(currentOwner, userA, 'owner should be userA');

		// Update owner
		hevm.prank(userA);
		defaultChannel.udpateOwner(userB);

		(address newOwner, , , , , , , ) = defaultChannel.channel();

		assertEq(newOwner, userB, 'owner should be userB');
	}

	function testCreatePost() external {
		// Attempt to create post from non-owner
		hevm.prank(userB);
		hevm.expectRevert(abi.encodePacked('only the channel owner can create a post'));
		defaultChannel.createPost(defaultPostParams);

		Channel.Post[] memory currentPosts = defaultChannel.getAllPosts();
		uint256 currentPostsLength = currentPosts.length;

		// Create post
		hevm.prank(userA);
		(uint256 postId, string memory postTitle) = defaultChannel.createPost(defaultPostParams);

		Channel.Post[] memory newPosts = defaultChannel.getAllPosts();
		uint256 newPostsLength = newPosts.length;

		assertEq(newPostsLength, currentPostsLength + 1, 'posts counter should be incremented');

		Channel.Post memory post = defaultChannel.getPostById(postId);

		assertEq(postId, post.id, 'id incorrect');
		assertEq(post.author, userA, 'author incorrect');
		assertEq(post.guid, guid, 'guid incorrect');
		assertEq(post.title, postTitle, 'title incorrect');
		assertEq(post.pubDate, pubDate, 'pubDate incorrect');
		assertEq(post.authorName, authorName, 'author name incorrect');
		assertEq(post.description, postDescription, 'description incorrect');
		assertEq(post.content, content, 'content incorrect');
		assertFalse(post.deleted, 'post should not be deleted');
	}

	function testUpdatePost() external {
		// Create post
		hevm.prank(userA);
		(uint256 postId, ) = defaultChannel.createPost(defaultPostParams);

		Channel.Post memory post = defaultChannel.getPostById(postId);

		string memory authorName = 'Updated Name';
		string memory postTitle = 'The Updated Post';
		string memory postDescription = 'Updated post example';
		string memory content = 'https://new.url/episode.mp3';

		Channel.Post memory updatedPost = Channel.Post({
			id: post.id,
			author: post.author,
			guid: post.guid,
			title: postTitle,
			pubDate: post.pubDate,
			authorName: authorName,
			description: postDescription,
			content: content,
			deleted: false
		});

		hevm.prank(userA);
		defaultChannel.updatePost(updatedPost);

		// Assert that the postById and posts of index id - 1 are equal
		Channel.Post memory postById = defaultChannel.getPostById(postId);
		Channel.Post memory postByIndex = defaultChannel.getPostByIndex(postId - 1);

		assertEq(postById.id, postByIndex.id, 'id incorrect');
		assertEq(postById.author, postByIndex.author, 'author incorrect');
		assertEq(postById.authorName, postByIndex.authorName, 'author name incorrect');
		assertEq(postById.title, postByIndex.title, 'title incorrect');
		assertEq(postById.description, postByIndex.description, 'description incorrect');
		assertEq(postById.content, postByIndex.content, 'content incorrect');
		assertFalse(postById.deleted, 'postById should not be deleted');
		assertFalse(postByIndex.deleted, 'postByIndex should not be deleted');
	}

	function testUpdatePostErrors() external {
		// Attempt to update post from non-owner
		hevm.prank(userB);
		hevm.expectRevert(abi.encodePacked('only the channel owner can update a post'));
		defaultChannel.updatePost(defaultPostParams);

		// Attempt to update a non-existent post
		hevm.prank(userA);
		hevm.expectRevert(abi.encodePacked('post does not exist'));
		defaultChannel.updatePost(defaultPostParams);

		// Create post
		hevm.prank(userA);
		(uint256 postId, ) = defaultChannel.createPost(defaultPostParams);

		Channel.Post memory post = defaultChannel.getPostById(postId);

		string memory invalidAuthorName = '';

		Channel.Post memory updatedPost = Channel.Post({
			id: post.id,
			author: post.author,
			guid: post.guid,
			title: postTitle,
			pubDate: post.pubDate,
			authorName: invalidAuthorName,
			description: postDescription,
			content: content,
			deleted: false
		});

		// Attempt to update post with invalid author name
		hevm.prank(userA);
		hevm.expectRevert(abi.encodePacked('author name is required'));
		defaultChannel.updatePost(updatedPost);
	}

	function testDeletePost() external {
		// Create post
		hevm.prank(userA);
		(uint256 postId, ) = defaultChannel.createPost(defaultPostParams);

		Channel.Post memory post = defaultChannel.getPostById(postId);

		assertEq(post.deleted, false, 'post should not be deleted');

		hevm.prank(userA);
		defaultChannel.deletePost(postId);

		Channel.Post memory deletedPost = defaultChannel.getPostById(postId);
		Channel.Post memory deletedPostByIndex = defaultChannel.getPostByIndex(postId - 1);

		assertEq(deletedPost.deleted, true, 'post in postId mapping should be deleted');
		assertEq(deletedPostByIndex.deleted, true, 'post in posts array should be deleted');
	}

	function testDeletePostErrors() external {
		// Attempt to delete post from non-owner
		hevm.prank(userB);
		hevm.expectRevert(abi.encodePacked('only the channel owner can delete a post'));
		defaultChannel.deletePost(1);

		// Attempt to delete a non-existent post
		hevm.prank(userA);
		hevm.expectRevert(abi.encodePacked('post does not exist'));
		defaultChannel.deletePost(1);

		// Create post
		hevm.prank(userA);
		(uint256 postId, ) = defaultChannel.createPost(defaultPostParams);

		hevm.prank(userA);
		defaultChannel.deletePost(postId);

		// Attempt to delete a deleted post
		hevm.prank(userA);
		hevm.expectRevert(abi.encodePacked('post already deleted'));
		defaultChannel.deletePost(postId);
	}

	function testUpdateChannel() external {
		string memory newTitle = 'New Title';
		string memory newDescription = 'New Description';

		ChannelFactory.ChannelInfo memory channel = channelFactory.getChannelInfo(
			address(defaultChannel)
		);

		assertEq(channel.title, title, 'title incorrect');

		Channel.ChannelParams memory channelUpdates = Channel.ChannelParams({
			owner: userA,
			title: newTitle,
			link: channelLink,
			language: language,
			description: newDescription,
			copyright: copyright,
			imageUrl: imageUrl,
			deleted: false
		});

		hevm.prank(userA);
		defaultChannel.updateChannel(channelUpdates);

		ChannelFactory.ChannelInfo memory updatedChannel = channelFactory.getChannelInfo(
			address(defaultChannel)
		);

		(, string memory defaultTitle, , , string memory defaultDescription, , , ) = defaultChannel
			.channel();

		assertEq(updatedChannel.title, newTitle, 'title not updated in factory');
		assertEq(defaultTitle, newTitle, 'title not updated in channel');
		assertEq(defaultDescription, newDescription, 'description not updated in channel');
	}

	function testUpdateChannelErrors() external {
		ChannelFactory.ChannelInfo memory channelInfo = channelFactory.getChannelInfo(
			address(defaultChannel)
		);

		hevm.prank(userB);
		hevm.expectRevert(abi.encodePacked('can only be updated by a channel'));
		channelFactory.updateChannel(channelInfo);
	}
}
