const TasksModel = require('../../models/tasks.model');

// get all task related count
const getAllTasksCount = async userId => {
  let filter = {};

  // Apply filter based on userId if provided
  if (userId && !isNaN(parseInt(userId))) {
    filter['taskReceiver.userId'] = parseInt(userId);
  }

  // Count all tasks in the database with the applied filter
  const totalTasksCount = await TasksModel.countDocuments(filter);

  // Count tasks by status without filtering by year
  const completedTasksCount = await TasksModel.countDocuments({
    ...filter,
    status: 'completed',
  });
  const pendingTasksCount = await TasksModel.countDocuments({
    ...filter,
    status: 'pending',
  });
  const inProgressTasksCount = await TasksModel.countDocuments({
    ...filter,
    status: 'progress',
  });
  const reviewTasksCount = await TasksModel.countDocuments({
    ...filter,
    status: 'review',
  });

  // Count tasks where the deadline has passed and the status is not 'completed'
  const overdueTasksCount = await TasksModel.countDocuments({
    ...filter,
    status: { $ne: 'completed' },
    taskDeadline: { $lt: new Date() }, // Deadline has passed
  });

  return {
    totalTasksCount,
    completedTasksCount,
    pendingTasksCount,
    inProgressTasksCount,
    reviewTasksCount,
    overdueTasksCount,
  };
};

const getTaskByDesignation = async (userId, designation, monthQuery) => {
  const designationTaskCounts = await TasksModel.aggregate([
    {
      $match: {
        ...monthQuery,
        approvalChain: {
          $elemMatch: {
            userId: parseInt(userId),
            designation,
            status: { $in: ['accepted', 'pending', 'completed', 'rejected'] },
          },
        },
      },
    },
    {
      $facet: {
        total: [{ $count: 'total' }],
        accepted: [
          {
            $match: {
              approvalChain: {
                $elemMatch: {
                  userId: parseInt(userId),
                  designation,
                  status: 'accepted',
                },
              },
            },
          },
          { $count: 'accepted' },
        ],
        pending: [
          {
            $match: {
              approvalChain: {
                $elemMatch: {
                  userId: parseInt(userId),
                  designation,
                  status: 'pending',
                },
              },
            },
          },
          { $count: 'pending' },
        ],
        rejected: [
          {
            $match: {
              approvalChain: {
                $elemMatch: {
                  userId: parseInt(userId),
                  designation,
                  status: 'rejected',
                },
              },
            },
          },
          { $count: 'rejected' },
        ],
      },
    },
  ]);

  const [designationTaskCountsData] = designationTaskCounts;
  const totalTasksCount = designationTaskCountsData.total[0]?.total || 0;
  const completedTasksCount =
    designationTaskCountsData.accepted[0]?.accepted || 0;
  const pendingTasksCount = designationTaskCountsData.pending[0]?.pending || 0;
  const rejectedTasks = designationTaskCountsData.rejected[0]?.rejected || 0;

  return {
    totalTasksCount,
    completedTasksCount,
    pendingTasksCount,
    rejectedTasks,
  };
};

const getAllTaskByDesignation = async (designation, userId) => {
  const designationTaskCounts = await TasksModel.aggregate([
    {
      $match: {
        approvalChain: {
          $elemMatch: {
            userId: parseInt(userId), // Matching userId within approvalChain
            designation,
            status: { $in: ['accepted', 'pending', 'completed', 'rejected'] },
          },
        },
      },
    },
    {
      $facet: {
        total: [{ $count: 'total' }],
        accepted: [
          {
            $match: {
              approvalChain: {
                $elemMatch: {
                  userId: parseInt(userId), // Matching userId within approvalChain
                  designation,
                  status: 'accepted',
                },
              },
            },
          },
          { $count: 'accepted' },
        ],
        pending: [
          {
            $match: {
              approvalChain: {
                $elemMatch: {
                  userId: parseInt(userId), // Matching userId within approvalChain
                  designation,
                  status: 'pending',
                },
              },
            },
          },
          { $count: 'pending' },
        ],
        rejected: [
          {
            $match: {
              approvalChain: {
                $elemMatch: {
                  userId: parseInt(userId), // Matching userId within approvalChain
                  designation,
                  status: 'rejected',
                },
              },
            },
          },
          { $count: 'rejected' },
        ],
      },
    },
  ]);

  const [designationTaskCountsData] = designationTaskCounts;
  const totalTasksCount = designationTaskCountsData.total[0]?.total || 0;
  const completedTasksCount =
    designationTaskCountsData.accepted[0]?.accepted || 0;
  const pendingTasksCount = designationTaskCountsData.pending[0]?.pending || 0;
  const rejectedTasks = designationTaskCountsData.rejected[0]?.rejected || 0;

  return {
    totalTasksCount,
    completedTasksCount,
    pendingTasksCount,
    rejectedTasks,
  };
};

// get task related count by year
exports.taskCount = async (req, res) => {
  try {
    const designation = req?.query.designation;
    const userId = req?.query?.userId;
    const month = req?.params?.month;
    const currentDate = new Date();
    const currentYear = new Date().getFullYear();

    // all task count for specific designation user id or all
    if (month === 'All') {
      if (
        designation &&
        designation !== 'none' &&
        userId &&
        !isNaN(parseInt(userId))
      ) {
        const allTaskCountData = await getAllTaskByDesignation(
          designation,
          userId
        );
        return res.status(201).json(allTaskCountData);
      }

      const allTaskCountData = await getAllTasksCount(userId);
      return res.status(201).json(allTaskCountData);
    }

    // Calculate the start and end dates for the specified month
    const startDate = new Date(`${currentYear}-${month}-01T00:00:00.000Z`);
    const endDate = new Date(currentYear, parseInt(month), 0, 23, 59, 59, 999);

    // Common query to filter tasks by the month
    let monthQuery = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    if (designation && designation !== 'none') {
      const designationData = await getTaskByDesignation(
        userId,
        designation,
        monthQuery
      );
      return res.status(201).json(designationData);
    }

    if (userId && !isNaN(parseInt(userId))) {
      monthQuery['taskReceiver.userId'] = parseInt(userId);
    }

    // Count all tasks for the specified month
    const totalTasksCount = await TasksModel.countDocuments(monthQuery);

    // Count tasks by status for the specified month
    const completedTasksCount = await TasksModel.countDocuments({
      ...monthQuery,
      status: 'completed',
    });
    const pendingTasksCount = await TasksModel.countDocuments({
      ...monthQuery,
      status: 'pending',
    });
    const inProgressTasksCount = await TasksModel.countDocuments({
      ...monthQuery,
      status: 'progress',
    });
    const reviewTasksCount = await TasksModel.countDocuments({
      ...monthQuery,
      status: 'review',
    });

    // Count tasks where the deadline has passed and the status is not 'completed'
    const overdueTasksCount = await TasksModel.countDocuments({
      ...monthQuery,
      status: { $ne: 'completed' },
      taskDeadline: { $lt: currentDate.toISOString() }, // Correct comparison for overdue
    });

    res.status(201).json({
      totalTasksCount,
      completedTasksCount,
      pendingTasksCount,
      inProgressTasksCount,
      reviewTasksCount,
      overdueTasksCount,
    });
  } catch (error) {
    // Handle any errors that occurred
    res.status(500).json({ message: 'Error retrieving task counts', error });
  }
};
