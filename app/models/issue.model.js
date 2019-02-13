const mongoose = require('mongoose');

const issuesSchema = mongoose.Schema({
    "issue_title":  {type: String, required: true},
    "issue_text":   {type: String, required: true},
    "created_on":   {type: Date, required: Date.now, required: true},
    "updated_on":   {type: Date, required: Date.now, required: true},
    "created_by":   {type: String, required: false},
    "assigned_to":  {type: String, required: false},
    "open":         {type: Boolean, default: false, required: false},
    "status_text":  {type: String, required: false}
});

module.exports = mongoose.model("Issue", issuesSchema);