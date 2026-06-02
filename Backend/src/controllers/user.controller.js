const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function followUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  if (followeeUsername === followerUsername) {
    return res.status(400).json({
      message: "You cannot follow yourself",
    });
  }

  const isFolloweeExists = await userModel.findOne({
    username: followeeUsername,
  });

  if (!isFolloweeExists) {
    return res.status(404).json({
      message: `User with the username ${followeeUsername} does not exists`,
    });
  }

  const existingFollow = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (existingFollow) {
    if (existingFollow.status === "accepted") {
      return res.status(200).json({
        message: `You are already following ${followeeUsername}`,
        follow: existingFollow,
      });
    }

    if (existingFollow.status === "pending") {
      return res.status(200).json({
        message: `Follow request for ${followeeUsername} is already pending`,
        follow: existingFollow,
      });
    }

    if (existingFollow.status === "rejected") {
      existingFollow.status = "pending";
      await existingFollow.save();

      return res.status(200).json({
        message: `Follow request resent to ${followeeUsername}`,
        follow: existingFollow,
      });
    }
  }

  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
  });

  res.status(201).json({
    message: `Follow request sent to ${followeeUsername}`,
    follow: followRecord,
  });
}

async function updateFollowStatusController(req, res) {
  const followeeUsername = req.user.username;
  const followerUsername = req.params.username;
  const { status } = req.body;

  const allowedStatuses = ["accepted", "rejected"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Status must be either 'accepted' or 'rejected'",
    });
  }

  const followRequest = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (!followRequest) {
    return res.status(404).json({
      message: `No follow request found from ${followerUsername}`,
    });
  }

  if (followRequest.status !== "pending") {
    return res.status(400).json({
      message: `This follow request has already been ${followRequest.status}`,
      follow: followRequest,
    });
  }

  followRequest.status = status;
  await followRequest.save();

  res.status(200).json({
    message: `Follow request ${status} successfully`,
    follow: followRequest,
  });
}

async function unfollowUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  const isUserFollowing = await followModel.findOne({
    followee: followeeUsername,
    follower: followerUsername,
  });

  if (!isUserFollowing) {
    return res.status(200).json({
      message: `You dont follow this user to unfollow`,
    });
  }

  await followModel.findByIdAndDelete(isUserFollowing._id);

  res.status(200).json({
    message: `You unfollowed ${followeeUsername}`,
  });
}

module.exports = {
  followUserController,
  updateFollowStatusController,
  unfollowUserController,
};
