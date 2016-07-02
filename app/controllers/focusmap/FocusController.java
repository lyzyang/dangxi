package controllers.focusmap;

import java.io.File;

import models.UtilTool;
import models.focusmap.Focus;
import models.information.Info;

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

	
	public static Result focus_getByNum() {
		DynamicForm in = Form.form().bindFromRequest();
		String limit = in.get("limit");
		
		if(limit == null || limit.length()==0){
	    	return ok();
		}
		
		JsonNode json = Focus.getFocusByNum(Integer.valueOf(limit));
		return ok(json);
	}
	
	
	/**
	 * 获取html页面
	 */
	public static Result focus_html() {
		return ok(focuss.render());
	}
	
	
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
	 * 修改
	 * @return
	 */
	@Transactional
	public static Result focus_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String picture_type = in.get("picture_type");
		
		JsonNode json;
		if(sid == null || sid.length()==0
				||picture_type == null || picture_type.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		int focus_info_size = Info.finder.where().eq("pictureType", 1).findRowCount();
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
		
		String pic = "";
		if (picture != null) {
			File file = picture.getFile();
			if(!UtilTool.isImage(file)){
				json = UtilTool.message(1, "只能上传图片！");
		    	return ok(json);
			}
			if(file.length()>1048576){
				json = UtilTool.message(1, "图片不能大于10M！");
		    	return ok(json);
			}
			pic = UtilTool.fileToString(file);
		}
		
		Info info = Info.finder.byId(Long.valueOf(sid));
		info.pictureType = Integer.valueOf(picture_type);
		info.picture = pic;
		
		info.updateInfo();
		json = UtilTool.message(0, "设置成功!");

		return ok(json);
	}
}
