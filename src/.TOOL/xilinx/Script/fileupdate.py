
import glob 
import os
import shutil
import linecache

def mkdir(path):
	folder = os.path.exists(path)
	if not folder:                  
		os.makedirs(path)    

def deldir(path):
	folder = os.path.exists(path)
	if folder:                  
		shutil.rmtree(path.replace("\\", "/"))    

def movedir(sourse_path,target_path,gen_path):
	folder = os.path.exists(os.path.join(sourse_path,gen_path).replace("\\", "/"))
	if folder :                  
		deldir(os.path.join(target_path,gen_path).replace("\\", "/"))
		shutil.move(os.path.join(sourse_path,gen_path).replace("\\", "/"),target_path)
	else :
		if gen_path != "TOP.v" :
			mkdir(os.path.join(target_path,gen_path).replace("\\", "/"))

def file_update(path) :
	fpga_include = linecache.getline(path,7)
	if fpga_include.replace('\n', '') == "none" :
		movedir("./user/Hardware","./user","src")
		movedir("./user/Hardware","./user","data")
		movedir("./user/Hardware","./user","sim")
		movedir("./user/Hardware","./user","TOP.v")
		deldir("./user/Hardware")
		deldir("./user/Software")
	else :
		mkdir("./user/Hardware")
		movedir("./user","./user/Hardware","TOP.v")
		movedir("./user","./user/Hardware","src")
		movedir("./user","./user/Hardware","data")
		movedir("./user","./user/Hardware","sim")
		mkdir("./user/Software/data")
		mkdir("./user/Software/src")

if __name__ == "__main__":
    file_update("./Makefile")