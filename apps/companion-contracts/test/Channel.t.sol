// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import './BaseTest.sol';

contract ChannelTest is BaseTest {
	function testChannelSetup() external {
		string memory currentTitle = defaultChannel.title();
		string memory currentSymbol = defaultChannel.symbol();
		string memory currentDescription = defaultChannel.description();

		assertEq(currentTitle, title, 'title incorrect');
		assertEq(currentSymbol, symbol, 'symbol incorrect');
		assertEq(currentDescription, description, 'description incorrect');

		Channel.Post[] memory currentPosts = defaultChannel.getAllPosts();
		assertEq(currentPosts.length, 0, 'posts should be empty');
	}

	function testUpdateOwner() external {
		address currentOwner = defaultChannel.owner();

		// Attempt to update owner from non-owner
		hevm.prank(userB);
		hevm.expectRevert(abi.encodePacked('not current owner'));
		defaultChannel.udpateOwner(userB);

		assertEq(currentOwner, userA, 'owner should be userA');

		// Update owner
		hevm.prank(userA);
		defaultChannel.udpateOwner(userB);

		address newOwner = defaultChannel.owner();

		assertEq(newOwner, userB, 'owner should be userB');
	}

	function testCreatePost() external {
		// Attempt to create post from non-owner
		hevm.prank(userB);
		hevm.expectRevert(abi.encodePacked('only the owner can create a post'));
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
		assertEq(post.authorName, authorName, 'author name incorrect');
		assertEq(post.title, postTitle, 'title incorrect');
		assertEq(post.link, link, 'link incorrect');
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
		string memory link = 'https://update.link/channeladdress';
		string memory postDescription = 'Updated post example';
		string memory content = 'https://new.url/episode.mp3';

		Channel.Post memory updatedPost = Channel.Post({
			id: post.id,
			author: post.author,
			authorName: authorName,
			title: postTitle,
			link: link,
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
		assertEq(postById.link, postByIndex.link, 'link incorrect');
		assertEq(postById.description, postByIndex.description, 'description incorrect');
		assertEq(postById.content, postByIndex.content, 'content incorrect');
		assertFalse(postById.deleted, 'postById should not be deleted');
		assertFalse(postByIndex.deleted, 'postByIndex should not be deleted');
	}

	function testUpdatePostErrors() external {
		// Attempt to update post from non-owner
		hevm.prank(userB);
		hevm.expectRevert(abi.encodePacked('only the owner can update a post'));
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
			authorName: invalidAuthorName,
			title: post.title,
			link: post.link,
			description: post.description,
			content: post.content,
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
		hevm.expectRevert(abi.encodePacked('only the owner can delete a post'));
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
}
