const TasksModel = require('../../models/tasks.model');

// Get all task-related counts
const getAllTasksCount = async userId => {
  let filter = {};

  // Apply filter based on userId if provided
  if (userId && !isNaN(parseInt(userId))) {
    filter['taskReceiver.userId'] = parseInt(userId);
  }

  // Count tasks in the database based on the applied filter
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
    taskDeadline: { $lt: new Date() },
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

// Get task counts filtered by user designation, status, and month
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

// Get task counts by designation without filtering by month
const getAllTaskByDesignation = async (designation, userId) => {
  const designationTaskCounts = await TasksModel.aggregate([
    {
      $match: {
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

// Get task-related counts by year and month, or by designation
exports.taskCount = async (req, res) => {
  try {
    const designation = req.query.designation;
    const userId = req.query.userId;
    const month = req.params.month;
    const currentYear = new Date().getFullYear();

    // All task counts for a specific designation and userId, or all tasks if month is 'All'
    if (month === 'All') {
      if (designation && designation !== 'none' && userId) {
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

    // Common query to filter tasks by the specified month
    let monthQuery = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    // Task counts filtered by designation within a specific month
    if (designation && designation !== 'none') {
      const designationData = await getTaskByDesignation(
        userId,
        designation,
        monthQuery
      );
      return res.status(201).json(designationData);
    }

    // Task counts for a specific userId within a specific month
    if (userId && !isNaN(parseInt(userId))) {
      monthQuery['taskReceiver.userId'] = parseInt(userId);
    }

    // Count tasks for the specified month
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

    // Count overdue tasks (deadline passed and status is not 'completed')
    const overdueTasksCount = await TasksModel.countDocuments({
      ...monthQuery,
      status: { $ne: 'completed' },
      taskDeadline: { $lt: new Date() },
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
    res.status(500).json({ message: 'Error retrieving task counts', error });
  }
};
