const MeetingHistory = require("../../model/schema/meeting");
const Meeting = require("../../model/schema/meeting");
const mongoose = require("mongoose");

const add = async (req, res) => {
  try {
    const { agenda, related, location, dateTime, createBy, notes } = req.body;

    // Create a new meeting document
    const meeting = new Meeting({
      agenda,
      related,
      location,
      createBy: mongoose.Types.ObjectId(createBy),
      notes,
      dateTime: dateTime || new Date().toISOString(),
      deleted: false, // Default value for deleted field
    });
    // Save the meeting to the database
    await meeting.save();
    res.status(200).json({ message: "Meeting created successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const index = async (req, res) => {
  try {
    const query = { ...req.query, deleted: false };

    let meeting = await Meeting.find(query)
      .populate({
        path: "agenda",
      })
      .exec();

    res.status(200).json({ meeting });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const view = async (req, res) => {
  try {
    let meeting = await Meeting.findOne({ _id: req.params.id }).populate({
      path: "agenda",
    });
    if (!meeting) return res.status(404).json({ message: "no Data Found." });
    res.status(200).json(meeting);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const deleteData = async (req, res) => {
  try {
    const meetingId = req.params.id;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res
        .status(404)
        .json({ success: false, message: "Meeting not found" });
    }

    // Update the meeting's 'deleted' field to true
    await Meeting.updateOne({ _id: meetingId }, { $set: { deleted: true } });
    res.send({ message: "Meeting Record deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const deleteMany = async (req, res) => {
  try {
    const meetingIds = req.body; // Assuming req.body is an array of meeting IDs
    const meetings = await Meeting.find({ _id: { $in: meetingIds } });

    if (meetings.length === 0) {
      return res
        .status(404)
        .json({ message: "No meetings found for the provided IDs." });
    }

    // Update the 'deleted' field to true for the specified meetings
    const updatedMeetings = await Meeting.updateMany(
      { _id: { $in: meetingIds } },
      { $set: { deleted: true } }
    );

    res.status(200).json({ message: "done", updatedMeetings });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

module.exports = { add, index, view, deleteData, deleteMany };
