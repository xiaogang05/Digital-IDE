const fs       = require("fs");
const file     = require("../file_IO/file_IO");
const terminal = require("../command/terminal");

function move_xbd_xIP(workspace_path, property_path) {
	let prj_info = file.pullJsonInfo(property_path);
	let target_path = "";
	let source_IP_path = `${workspace_path}prj/xilinx/${prj_info.PRJ_NAME.FPGA}.srcs/sources_1/ip`;
	let source_bd_path = `${workspace_path}prj/xilinx/${prj_info.PRJ_NAME.FPGA}.srcs/sources_1/bd`;
	if (prj_info.SOC_MODE.soc == "none") {
		target_path = `${workspace_path}user`;
	}else{
		target_path = `${workspace_path}user/Hardware`;
	}
	if (fs.existsSync(source_IP_path)) {
		fs.readdirSync(source_IP_path).forEach(element => {
			file.movedir(`${source_IP_path}/${element}`,`${target_path}/IP`)
		});
	}
	if (fs.existsSync(source_bd_path)) {
		fs.readdirSync(source_bd_path).forEach(element => {
			file.movedir(`${source_bd_path}/${element}`,`${target_path}/bd`)
		});
	}
}
exports.move_xbd_xIP = move_xbd_xIP;

function xclean(workspace_path,mode) {
	if (mode == "all") {
		file.deleteDir(`${workspace_path}prj`);
	}
	file.deleteDir(`${workspace_path}.Xil`);
	let file_list = file.pick_file(workspace_path,".jou");
	file_list.forEach(element => {
		file.deleteFile(`${workspace_path}${element}`)
	});
	file_list = pick_file(workspace_path,".log");
	file_list.forEach(element => {
		file.deleteFile(`${workspace_path}${element}`)
	});
	file_list = pick_file(workspace_path,".str");
	file_list.forEach(element => {
		file.deleteFile(`${workspace_path}${element}`)
	});
}
exports.xclean = xclean;

function pick_elf_file(boot_path) {
	let elf_list = file.pick_file(boot_path,".elf");
		elf_list = elf_list.filter(function (elf_file) {
		return elf_file !== 'fsbl.elf';
	});
	return elf_list
}

function xbootgenerate(workspace_path,root_path) {
	let BOOT_folder = `${workspace_path}user/BOOT`;
	let output_path = `${root_path}/.TOOL/Xilinx/BOOT`;

	let elf_path  = '';
	let bit_path  = '';
	let fsbl_path = '';

	let elf_list = [""];
	let bit_list = [""];

	let output_context =  "//arch = zynq; split = false; format = BIN\n";
		output_context += "the_ROM_image:\n";
		output_context += "{\n";

	if (file.ensureExists(BOOT_folder)) {
		if (file.ensureExists(BOOT_folder+"/fsbl.elf")) {
			fsbl_path = `\t[bootloader]${BOOT_folder}/fsbl.elf\n`;
		}
		else {
			fsbl_path = "\t[bootloader]" + output_path + "/fsbl.elf\n";
		}
		elf_list = pick_elf_file(BOOT_folder);
		if (elf_list.length == 1) {
			elf_path = "\t" + BOOT_folder + "/" + elf_list[0] + "\n";
			bit_list = file.pick_file(workspace_path,".bit");
				if (bit_list.length <= 1) {
					if (bit_list.length == 0) {
						vscode.window.showWarningMessage("The bit file was not found\nThe elf file was generated as a bin file");
					}
					bit_path = "\t" + workspace_path + bit_list[0] + "\n";
					output_context += fsbl_path + bit_path + elf_path + "}";
					file.writeFile(`${output_path}/output.bif`,output_context);
					let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
					terminal.runCmd(cmd);	
				}
				else{
					vscode.window.showQuickPick(bit_list).then(selection => {
						if (!selection) {
							return;
						}
						bit_path = "\t" + workspace_path + selection + "\n";
						output_context += fsbl_path + bit_path + elf_path + "}";
						file.writeFile(`${output_path}/output.bif`,output_context);
						let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
						terminal.runCmd(cmd);	
					});
				}
		}
		else {
			vscode.window.showQuickPick(elf_list).then(selection => {
				if (!selection) {
					return;
				}
				elf_path = "\t" + BOOT_folder + "/" + selection + "\n";
				bit_list = file.pick_file(workspace_path,".bit");
				if (bit_list.length <= 1) {
					if (bit_list.length == 0) {
						vscode.window.showWarningMessage("The bit file was not found\nThe elf file was generated as a bin file");
					}
					bit_path = "\t" + workspace_path + bit_list[0] + "\n";
					output_context += fsbl_path + bit_path + elf_path + "}";
					file.writeFile(`${output_path}/output.bif`,output_context);
					let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
					terminal.runCmd(cmd);	
				}
				else{
					vscode.window.showQuickPick(bit_list).then(selection => {
						if (!selection) {
							return;
						}
						bit_path = "\t" + workspace_path + selection + "\n";
						output_context += fsbl_path + bit_path + elf_path + "}";
						file.writeFile(`${output_path}/output.bif`,output_context);
						let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
						terminal.runCmd(cmd);		
					});
				}
			});
		}
	}
	else {
		fsbl_path = "\t[bootloader]" + output_path + "/fsbl.elf\n";
		elf_list = pick_elf_file(output_path);
		if (elf_list.length == 1) {
			elf_path = "\t" + output_path + "/" + elf_list[0] + "\n";
			bit_list = file.pick_file(workspace_path,".bit");
			if (bit_list.length == 0) {
				vscode.window.showErrorMessage("The bit file was not found\nCannot only BOOT the pl part");
			} else if (bit_list.length == 1) {
				bit_path = "\t" + workspace_path + bit_list[0] + "\n";
				output_context += fsbl_path + bit_path + elf_path + "}";
				file.writeFile(`${output_path}/output.bif`,output_context);
				let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
				terminal.runCmd(cmd);	
			} else if (bit_list.length > 1) {
				vscode.window.showQuickPick(bit_list).then(selection => {
					if (!selection) {
						return;
					}
					bit_path = "\t" + workspace_path + selection + "\n";
					output_context += fsbl_path + bit_path + elf_path + "}";
					file.writeFile(`${output_path}/output.bif`,output_context);
					let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
					terminal.runCmd(cmd);	
				});
			}
		} else {
			vscode.window.showQuickPick(elf_list).then(selection => {
				if (!selection) {
					return;
				}
				elf_path = "\t" + output_path + "/" + selection + "\n";
				bit_list = file.pick_file(workspace_path,".bit");
				if (bit_list.length <= 1) {
					if (bit_list.length == 0) {
						vscode.window.showWarningMessage("The bit file was not found\nThe elf file was generated as a bin file");
					}
					bit_path = "\t" + workspace_path + bit_list[0] + "\n";
					output_context += fsbl_path + bit_path + elf_path + "}";
					file.writeFile(`${output_path}/output.bif`,output_context);
					let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
					terminal.runCmd(cmd);	
				}
				else{
					vscode.window.showQuickPick(bit_list).then(selection => {
						if (!selection) {
							return;
						}
						bit_path = "\t" + workspace_path + selection + "\n";
						output_context += fsbl_path + bit_path + elf_path + "}";
						file.writeFile(`${output_path}/output.bif`,output_context);
						let cmd = `bootgen -arch zynq -image ${output_path}/output.bif -o ${workspace_path}BOOT.bin -w on`;
						terminal.runCmd(cmd);		
					});
				}
			});
		}
	}
}
exports.xbootgenerate = xbootgenerate;