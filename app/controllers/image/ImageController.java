package controllers.image;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import models.UtilTool;
import play.data.DynamicForm;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Http.MultipartFormData;
import play.mvc.Http.MultipartFormData.FilePart;

public class ImageController extends Controller{

	public static final String fileFolder = "upload/image/";
	
	/**
	 * 查看图片
	 * @return
	 */
	public static Result image_get(String file){
		File storeFile = new File("upload/"+file);
		if(storeFile.exists()){
			return ok(storeFile);
		}else{
			return ok();
		}
	}
	
	/**
	 * 图片上传
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
			if(file.length()>10485760){
				json.put("error", 1);
				json.put("message", "图片不能大于10M！");  
		    	return ok(json);
			}
			
			String fileName = picture.getFilename();
			int idx = fileName.lastIndexOf(".");
			fileType = fileName.substring(idx + 1, fileName.length());
			
			String new_filename = get_image_path() + (new Date()).getTime()+ "."+ fileType;
			File storeFile = new File(new_filename);
	        play.api.libs.Files.copyFile(file, storeFile, false, false);
	       
			json.put("error", 0);
			json.put("url", new_filename);
			json.put("message", "上传成功！");  
			return ok(json);
		}else{
			json.put("error", 1);
			json.put("message", "上传失败！");  
			return ok(json);
		}
    }
	
	/**
	 * 图片管理
	 * @return
	 */
	public static Result image_manager() {  
		DynamicForm in = Form.form().bindFromRequest();
		String path = in.get("path");
		
		String currentPath = fileFolder + path;  
        String currentUrl = fileFolder + path;  
        String currentDirPath = path;  
        String moveupDirPath = "";  
        if (!"".equals(path)) {  
            String str = currentDirPath.substring(0, currentDirPath.length() - 1);  
            moveupDirPath = str.lastIndexOf("/") >= 0 ? str.substring(0, str.lastIndexOf("/") + 1) : "";  
        }  
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode();
 
       // 检查当前目录  
       File curPathFile = new File(currentPath);  
       if (!curPathFile.isDirectory()) {  
    	   json.put("error", 1);  
    	   json.put("message", "当前目录不存在.");  
           return ok(json);  
       }  
       //遍历目录取的文件信息  
       ArrayNode array = mapper.createArrayNode ();
       
       if(curPathFile.listFiles() != null) {  
           for (File file : curPathFile.listFiles()) {  
        	   ObjectNode appJson = mapper.createObjectNode();
               String fileName = file.getName();  
               if(file.isDirectory()) {  
            	   appJson.put("is_dir", true);  
            	   appJson.put("has_file", (file.listFiles() != null));  
            	   appJson.put("filesize", 0L);  
                   appJson.put("is_photo", false);  
                   appJson.put("filetype", "");  
               } else if(file.isFile()){  
                   String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();  
                   appJson.put("is_dir", false);  
                   appJson.put("has_file", false);  
                   appJson.put("filesize", file.length());  
                   appJson.put("is_photo", true);
                   appJson.put("filetype", fileExt);  
               }  
               appJson.put("filename", fileName);  
               appJson.put("datetime", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(file.lastModified()));  
               array.add(appJson);  
           }  
       }  
       
       // 输出遍历后的文件信息数据  
       if(path != null && path.length() != 0)  json.put("moveup_dir_path", "");  
       else  json.put("moveup_dir_path", moveupDirPath);  
       json.put("current_dir_path", currentDirPath);  
       json.put("current_url", currentUrl);  
       json.put("total_count", array.size());  
       json.put("file_list", array);          
       return ok(json);  
   }  
     
  
	public static String get_image_path(){
		String path = fileFolder + UtilTool.year_mouth_dd.format(new Date()) + "/";
		return path;
	} 
}
