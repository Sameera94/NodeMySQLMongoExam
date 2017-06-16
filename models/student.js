'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new mongoose.Schema({
	name: String,
    age: String,
    created: { type: Date, default: Date.now }
});

var Student = module.exports = mongoose.model('Student',StudentSchema);

module.exports.addNewStudent = function(newStudent, callback){
    newStudent.save(callback);
}

module.exports.getAllStudents = function(callback){
	Student.find({},callback);
}

module.exports.deleteStudent = function(_id,callback){
    Student.remove( { _id :_id },callback );
};

module.exports.updateStudent = function(_id,name,age,callback){
	Student.update({ _id:_id},{ $set:{ name: name,age: age} }, callback);
}

// module.exports.updateAppointment = function(_id,header,body,date,time,venue,callback){
//     Meeting.update({ _id:_id},{ $set:{ header:header,body:body,date:date,time:time,venue:venue,status:"updated" }},callback);
// };