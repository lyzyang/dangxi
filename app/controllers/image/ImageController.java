package controllers.image;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import models.UtilTool;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Http.MultipartFormData;
import play.mvc.Http.MultipartFormData.FilePart;

public class ImageController extends Controller{

	public static final String fileFolder = "upload/image/";
	
	/**
	 * 主页更多
	 * @return
	 */
	public static Result image_upload() {
		MultipartFormData body = request().body().asMultipartFormData();
		FilePart picture = null;
		try {
			picture = body.getFile("imgFile");
		} catch (Exception e1) {
		}
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode();
		String fileType = "png";
		if (picture != null) {
			File file = picture.getFile();
			if(!UtilTool.isImage(file)){
				json.put("error", 1);
				json.put("message", "只能上传图片！");  
		    	return ok(json);
			}
			if(file.length()>1048576){
				json.put("error", 1);
				json.put("message", "图片不能大于10M！");  
		    	return ok(json);
			}
			
			String fileName = picture.getFilename();
			int idx = fileName.lastIndexOf(".");
			fileType = fileName.substring(idx + 1, fileName.length());
			
			String filename = fileFolder + (new Date()).getTime()+ "."+ fileType;
			File storeFile = new File(filename);
	        play.api.libs.Files.copyFile(file, storeFile, false, false);
	       
			json.put("error", 0);
			json.put("url", filename);
			json.put("message", "上传成功！");  
			return ok(json);
		}else{
			json.put("error", 1);
			json.put("message", "上传失败！");  
			return ok(json);
		}
    }
	
	
	public static Result image_manager() {  
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode();
       
       // 检查当前目录  
       File curPathFile = new File(fileFolder);  
       if (!curPathFile.isDirectory()) {  
    	   json.put("error", 1);  
    	   json.put("message", "当前目录不存在.");  
           return ok(json);  
       }  
       //遍历目录取的文件信息  
       @SuppressWarnings("rawtypes")  
       List<HashMap> fileList = new ArrayList<HashMap>();  
       if (curPathFile.listFiles() != null) {  
           for (File file : curPathFile.listFiles()) {  
               HashMap<String, Object> hash = new HashMap<String, Object>();  
               String fileName = file.getName();  
               if (file.isFile()) {  
                   String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();  
                   hash.put("is_dir", false);  
                   hash.put("has_file", false);  
                   hash.put("filesize", file.length());  
                   hash.put("is_photo", Arrays.<String>asList(extMap.get("image").split(",")).contains(fileExt));  
                   hash.put("filetype", fileExt);  
               }  
               hash.put("filename", fileName);  
               hash.put("datetime", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(file.lastModified()));  
               fileList.add(hash);  
           }  
       }  
       
       // 输出遍历后的文件信息数据  
       json.put("total_count", fileList.size());  
       json.put("file_list", fileList);          
       return ok(json);  
   }  
     
  
}
