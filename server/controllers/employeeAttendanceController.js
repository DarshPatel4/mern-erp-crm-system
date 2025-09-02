const EmployeeAttendance = require('../models/EmployeeAttendance');
const Employee = require('../models/Employee');
const mongoose = require('mongoose');

// Check-in employee
exports.checkIn = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    // Check if already checked in today
    const existingAttendance = await EmployeeAttendance.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      date: today
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    // Create or update attendance record
    let attendance;
    if (existingAttendance) {
      attendance = await EmployeeAttendance.findByIdAndUpdate(
        existingAttendance._id,
        {
          checkInTime: currentDate,
          status: 'present'
        },
        { new: true }
      );
    } else {
      attendance = await EmployeeAttendance.create({
        employeeId: new mongoose.Types.ObjectId(employeeId),
        date: today,
        checkInTime: currentDate,
        status: 'present'
      });
    }

    res.json({
      message: 'Check-in successful',
      attendance: {
        id: attendance._id,
        checkInTime: attendance.checkInTime,
        status: attendance.status
      }
    });
  } catch (error) {
    console.error('Error during check-in:', error);
    res.status(500).json({ error: 'Failed to check in' });
  }
};

// Check-out employee
exports.checkOut = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    // Find today's attendance record
    const attendance = await EmployeeAttendance.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      date: today
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ error: 'No check-in record found for today' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ error: 'Already checked out today' });
    }

    // Calculate working hours
    const checkInTime = new Date(attendance.checkInTime);
    const workingHoursMs = currentDate.getTime() - checkInTime.getTime();
    const workingHoursMinutes = Math.floor(workingHoursMs / (1000 * 60));

    // Update attendance record
    const updatedAttendance = await EmployeeAttendance.findByIdAndUpdate(
      attendance._id,
      {
        checkOutTime: currentDate,
        workingHours: workingHoursMinutes,
        status: 'completed'
      },
      { new: true }
    );

    res.json({
      message: 'Check-out successful',
      attendance: {
        id: updatedAttendance._id,
        checkInTime: updatedAttendance.checkInTime,
        checkOutTime: updatedAttendance.checkOutTime,
        workingHours: updatedAttendance.workingHours,
        status: updatedAttendance.status
      }
    });
  } catch (error) {
    console.error('Error during check-out:', error);
    res.status(500).json({ error: 'Failed to check out' });
  }
};

// Start break
exports.startBreak = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    // Find today's attendance record
    const attendance = await EmployeeAttendance.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      date: today
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ error: 'No check-in record found for today' });
    }

    if (attendance.breakStartTime && !attendance.breakEndTime) {
      return res.status(400).json({ error: 'Break already started' });
    }

    // Update attendance record
    const updatedAttendance = await EmployeeAttendance.findByIdAndUpdate(
      attendance._id,
      {
        breakStartTime: currentDate
      },
      { new: true }
    );

    res.json({
      message: 'Break started',
      attendance: {
        id: updatedAttendance._id,
        breakStartTime: updatedAttendance.breakStartTime
      }
    });
  } catch (error) {
    console.error('Error starting break:', error);
    res.status(500).json({ error: 'Failed to start break' });
  }
};

// End break
exports.endBreak = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    // Find today's attendance record
    const attendance = await EmployeeAttendance.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      date: today
    });

    if (!attendance || !attendance.breakStartTime) {
      return res.status(400).json({ error: 'No break started for today' });
    }

    if (attendance.breakEndTime) {
      return res.status(400).json({ error: 'Break already ended' });
    }

    // Calculate break duration
    const breakStartTime = new Date(attendance.breakStartTime);
    const breakDurationMs = currentDate.getTime() - breakStartTime.getTime();
    const breakDurationMinutes = Math.floor(breakDurationMs / (1000 * 60));

    // Update attendance record
    const updatedAttendance = await EmployeeAttendance.findByIdAndUpdate(
      attendance._id,
      {
        breakEndTime: currentDate,
        totalBreakTime: breakDurationMinutes
      },
      { new: true }
    );

    res.json({
      message: 'Break ended',
      attendance: {
        id: updatedAttendance._id,
        breakEndTime: updatedAttendance.breakEndTime,
        totalBreakTime: updatedAttendance.totalBreakTime
      }
    });
  } catch (error) {
    console.error('Error ending break:', error);
    res.status(500).json({ error: 'Failed to end break' });
  }
};

// Get today's attendance status
exports.getTodayStatus = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    const attendance = await EmployeeAttendance.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      date: today
    });

    if (!attendance) {
      return res.json({
        isCheckedIn: false,
        checkInTime: null,
        checkOutTime: null,
        workingHours: 0,
        status: 'Not Started',
        breakStatus: 'No Break'
      });
    }

    let workingHours = 0;
    if (attendance.checkInTime && attendance.checkOutTime) {
      const checkInTime = new Date(attendance.checkInTime);
      const checkOutTime = new Date(attendance.checkOutTime);
      const workingHoursMs = checkOutTime.getTime() - checkInTime.getTime();
      workingHours = Math.floor(workingHoursMs / (1000 * 60));
    } else if (attendance.checkInTime) {
      const checkInTime = new Date(attendance.checkInTime);
      const currentTime = new Date();
      const workingHoursMs = currentTime.getTime() - checkInTime.getTime();
      workingHours = Math.floor(workingHoursMs / (1000 * 60));
    }

    let breakStatus = 'No Break';
    if (attendance.breakStartTime && attendance.breakEndTime) {
      breakStatus = 'Break Completed';
    } else if (attendance.breakStartTime) {
      breakStatus = 'On Break';
    }

    res.json({
      isCheckedIn: !!attendance.checkInTime,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      workingHours,
      status: attendance.status,
      breakStatus,
      lastCheckIn: attendance.checkInTime ? 
        new Date(attendance.checkInTime).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }) : null
    });
  } catch (error) {
    console.error('Error getting today\'s status:', error);
    res.status(500).json({ error: 'Failed to get attendance status' });
  }
};

// Get monthly attendance summary
exports.getMonthlySummary = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const monthStart = new Date(targetYear, targetMonth, 1);
    const monthEnd = new Date(targetYear, targetMonth + 1, 0);

    const attendance = await EmployeeAttendance.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      date: { $gte: monthStart, $lte: monthEnd }
    }).sort({ date: 1 });

    // Create calendar data
    const calendarData = {};
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      const date = new Date(targetYear, targetMonth, day);
      const attendanceRecord = attendance.find(a => 
        a.date.getDate() === day && 
        a.date.getMonth() === targetMonth && 
        a.date.getFullYear() === targetYear
      );

      if (attendanceRecord) {
        calendarData[day] = attendanceRecord.status;
      } else {
        calendarData[day] = 'none';
      }
    }

    // Calculate summary
    const summary = attendance.reduce((acc, record) => {
      acc.totalDays++;
      if (record.status === 'present') acc.presentDays++;
      else if (record.status === 'absent') acc.absentDays++;
      else if (record.status === 'leave') acc.leaveDays++;
      return acc;
    }, { totalDays: 0, presentDays: 0, absentDays: 0, leaveDays: 0 });

    res.json({
      calendarData,
      summary,
      month: targetMonth + 1,
      year: targetYear
    });
  } catch (error) {
    console.error('Error getting monthly summary:', error);
    res.status(500).json({ error: 'Failed to get monthly summary' });
  }
};
