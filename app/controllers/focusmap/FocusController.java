package controllers.focusmap;

import java.io.File;
import java.util.Date;

import models.UtilTool;
import models.focusmap.Focus;
import models.information.Info;
import be.objectify.deadbolt.java.actions.Pattern;

import com.fasterxml.jackson.databind.JsonNode;

import play.data.DynamicForm;
import play.data.Form;
import play.db.ebean.Transactional;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Http.MultipartFormData;
import play.mvc.Http.MultipartFormData.FilePart;
import views.html.focusmap.focuss;

public class FocusController extends Controller{

	public static final String fileFolder = "upload/focus/";
	
	/**
	 * 获取焦点
	 * @return
	 */
	public static Result focus_get() {
		JsonNode json = Focus.getFocusJson();
		return ok(json);
	}
	
	////////////////////////////////////////
	
	
	/**
	 * 获取html页面
	 */
	@Pattern("focus_html")
	public static Result focus_html() {
		return ok(focuss.render());
	}
	
	/**
	 * 信息分页列表
	 * @return
	 */
	@Pattern("focus_html")
	public static Result focus_page_json() {
		DynamicForm in = Form.form().bindFromRequest();
		int limit = Integer.valueOf(in.get("limit"));
		int offset = Integer.valueOf(in.get("offset"));
		String order = in.get("order");
		String sort = in.get("sort");
		String search = in.get("search");
		
		JsonNode json = Focus.getFocusPageJson(limit, offset, order, sort, search);
		return ok(json);
	}
	
	
	/**
	 * 设置焦点
	 * @return
	 */
	@Pattern("focus_html")
	@Transactional
	public static Result focus_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		
		JsonNode json;
		if(sid == null || sid.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		int focus_info_size = Info.finder.where().isNotNull("picture").findRowCount();
		if(focus_info_size>=5){
			json = UtilTool.message(1, "焦点图超过5张，清先取消！");
	    	return ok(json);
		}
		
		MultipartFormData body = request().body().asMultipartFormData();
		FilePart picture = null;
		try {
			picture = body.getFile("picture");
		} catch (Exception e1) {
		}
		
		if (picture != null) {
			File file = picture.getFile();
			if(!UtilTool.isImage(file)){
				json = UtilTool.message(1, "只能上传图片！");
		    	return ok(json);
			}
			if(file.length()>10485760){
				json = UtilTool.message(1, "图片不能大于10M！");
		    	return ok(json);
			}
			
			String fileName = picture.getFilename();
			int idx = fileName.lastIndexOf(".");
			String fileType = fileName.substring(idx + 1, fileName.length());
			
			String new_filename = fileFolder + (new Date()).getTime()+ "."+ fileType;
			File storeFile = new File(new_filename);
	        play.api.libs.Files.copyFile(file, storeFile, false, false);
	        
	        Info info = Info.finder.byId(Long.valueOf(sid));
			info.picture = new_filename;
			info.updateInfo();
			json = UtilTool.message(0, "设置成功!");
		}else{
			json = UtilTool.message(0, "设置失败!");
		}

		return ok(json);
	}
	
	/**
	 * 取消焦点
	 * @return
	 */
	@Pattern("focus_html")
	@Transactional
	public static Result focus_del(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		
		JsonNode json;
		if(sid == null || sid.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		Info info = Info.finder.byId(Long.valueOf(sid));
		info.picture = null;
		
		info.updateInfo();
		json = UtilTool.message(0, "取消成功!");

		return ok(json);
	}
}
