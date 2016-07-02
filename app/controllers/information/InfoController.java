package controllers.information;

import java.io.File;
import java.util.Date;

import com.fasterxml.jackson.databind.JsonNode;

import models.UtilTool;
import models.information.Info;
import models.information.InfoType;
import models.userbehavior.AuthorisedUser;
import play.data.DynamicForm;
import play.data.Form;
import play.db.ebean.Transactional;
import play.mvc.Controller;
import play.mvc.Http.MultipartFormData;
import play.mvc.Http.MultipartFormData.FilePart;
import play.mvc.Result;
import views.html.information.infos;
import views.html.information.infoAdds;

/**
 * @author lyz
 *
 */
public class InfoController extends Controller {
	
	
	public static Result info_get(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("id");
		
		if(sid == null || sid.length()==0){
	    	return ok();
		}
		
		JsonNode json = Info.getInfo(Long.valueOf(sid));
		return ok(json);
	}
	
	
	public static Result info_getByType(){
		DynamicForm in = Form.form().bindFromRequest();
		String typeId = in.get("typeId");
		String limit = in.get("limit");
		
		if(typeId == null || typeId.length()==0
				||limit == null || limit.length()==0){
	    	return ok();
		}
		
		JsonNode json = Info.getInfoByType(Long.valueOf(typeId),Integer.valueOf(limit));
		return ok(json);
	}
	
	
	
	/**
	 * 获取html页面
	 */
	public static Result info_html() {
		return ok(infos.render());
	}
	
	
	public static Result info_page_json() {
		DynamicForm in = Form.form().bindFromRequest();
		int limit = Integer.valueOf(in.get("limit"));
		int offset = Integer.valueOf(in.get("offset"));
		String order = in.get("order");
		String sort = in.get("sort");
		String search = in.get("search");
		String infoType_id = in.get("infoType_id");
		
		JsonNode json = Info.getInfoPageJson(limit,offset,order,sort,search,infoType_id);
		return ok(json);
	}
	
	
	/**
	 * 获取html页面
	 */
	public static Result infoAdd_html() {
		DynamicForm in = Form.form().bindFromRequest();
		String id = in.get("id");
		String re_id = "";
		if(id != null && id.length() != 0){
			re_id = id;
		}
		return ok(infoAdds.render(re_id));
	}
	
	/**
	 * 添加
	 */
	@Transactional
	public static Result info_add(){  
		String user_id = Controller.session("id");
		
		DynamicForm in = Form.form().bindFromRequest();
		String title = in.get("title");
		String remark = in.get("remark");
		String type_id = in.get("type_id");
		String content = in.get("content");
		
		MultipartFormData body = request().body().asMultipartFormData();
		FilePart picture = null;
		try {
			picture = body.getFile("picture");
		} catch (Exception e1) {
		}
		
		JsonNode json;
		if(title == null || title.length()==0
				||remark == null || remark.length()==0
				||type_id == null || type_id.length()==0
				||content == null || content.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
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
		
		Info info = new Info();
		info.title = title;
		info.remark = remark;
		
		InfoType infoType = new InfoType();
		infoType.id = Long.valueOf(type_id);
		info.infoType = infoType;
		
		info.content = content;
		info.picture = pic;
		
		AuthorisedUser user = new AuthorisedUser();
		user.id = Integer.valueOf(user_id);
		info.user = user;
		
		info.createTime = new Date();
		info.lastUpdateTime = new Date();
		info.type = 1;

		info.addInfo();
		
		json = UtilTool.message(0, "添加成功!");
	
    	return ok(json);
	}
	
	/**
	 * 修改
	 * @return
	 */
	@Transactional
	public static Result info_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String title = in.get("title");
		String remark = in.get("remark");
		String type_id = in.get("type_id");
		String content = in.get("content");
		
		MultipartFormData body = request().body().asMultipartFormData();
		FilePart picture = null;
		try {
			picture = body.getFile("picture");
		} catch (Exception e1) {
		}
		
		JsonNode json;
		if(sid == null || sid.length()==0
				||title == null || title.length()==0
				||remark == null || remark.length()==0
				||type_id == null || type_id.length()==0
				||content == null || content.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
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
		
		Info info = new Info();
		info.id = Integer.valueOf(sid);
		info.title = title;
		info.remark = remark;
		
		InfoType infoType = new InfoType();
		infoType.id = Long.valueOf(type_id);
		info.infoType = infoType;
		
		info.content = content;
		
		if(pic.length() > 0) info.picture = pic;
		
		if(picture != null){
			File file = picture.getFile();
			info.picture = UtilTool.fileToString(file);
		}
		
		info.lastUpdateTime = new Date();

		info.updateInfo();
		json = UtilTool.message(0, "修改成功!");

		return ok(json);
	}
	
	/**
	 * 删除
	 * @return
	 */
	@Transactional
	public static Result info_del(){
		DynamicForm in = Form.form().bindFromRequest();
		String id_array =in.get("id_array");
		
		JsonNode json;
		new Info().delInfo(id_array);
		json = UtilTool.message(0, "删除成功!");
		
		return ok(json);
	}
	
	/**
	 * 显示
	 * @return
	 */
	@Transactional
	public static Result info_open(){
		DynamicForm in = Form.form().bindFromRequest();
		String id_array =in.get("id_array");
		
		JsonNode json;
		new Info().openInfo(id_array);
		json = UtilTool.message(0, "显示成功!");
		
		return ok(json);
	}
	
	/**
	 * 隐藏
	 * @return
	 */
	@Transactional
	public static Result info_close(){
		DynamicForm in = Form.form().bindFromRequest();
		String id_array =in.get("id_array");
		
		JsonNode json;
		new Info().closeInfo(id_array);
		json = UtilTool.message(0, "隐藏成功!");
		
		return ok(json);
	}
}
