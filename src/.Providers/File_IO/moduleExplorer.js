"use strict";

const vscode = require("vscode");

function delComment(content) {
	content = content.replace(/\/\/.*/g,'');
	content = content.replace(/\/\*[\s\S]*?\*\//g,'');
	return content;
}
exports.delComment = delComment;

function getModuleName(content) {
	content = delComment(content);
	let moduleNameList = [];
	let moduleList = content.match(/module\s*([a-zA-Z_][a-zA-Z_0-9]*)\s*(\#\s*\(|\()/g);
	if (moduleList == null) {
		return null;
	} else {
		moduleList.forEach(element => {
			element = element.replace(/module\s*/g,"");
			element = element.replace(/\s*(\#\s*\(|\()/g,"");
			moduleNameList.push(element);
		});
		return moduleNameList;
	}
}
exports.getModuleName = getModuleName;

function getInstanceModuleName(content) {
	content = delComment(content);
	let moduleNameList = [];
	let moduleList = content.match(/([a-zA-Z_][a-zA-Z_0-9]*)\s*([a-zA-Z_][a-zA-Z_0-9]*)\s*(\#\s*\(\s*\.|\(\s*\.)/g);
	if (moduleList == null) {
		return null;
	} else {
		moduleList.forEach(element => {
			element = element.replace(/\s*([a-zA-Z_][a-zA-Z_0-9]*)\s*(\#\s*\(\s*\.|\(\s*\.)/g,"");
			moduleNameList.push(element);
		});
		return moduleNameList;
	}
}
exports.getInstanceModuleName = getInstanceModuleName;

function getInputName(content) {
	let moduleNameList = [];
	let moduleList = content.match(/input([a-zA-Z_][a-zA-Z_0-9]*)(\#\(|\()/g);
	if (moduleList == null) {
		return null;
	} else {
		moduleList.forEach(element => {
			element = element.replace(/module/g,"");
			element = element.replace(/(\#\(|\()/g,"");
			moduleNameList.push(element);
		});
		return moduleNameList;
	}
}
exports.getInputName = getInputName;