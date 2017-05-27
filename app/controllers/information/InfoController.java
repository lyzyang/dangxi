package controllers.information;

import java.util.Date;

import be.objectify.deadbolt.java.actions.Pattern;

import com.fasterxml.jackson.databind.JsonNode;

import models.UtilTool;
import models.information.Info;
import models.information.InfoType;
import models.userbehavior.AuthorisedUser;
import play.data.DynamicForm;
import play.data.Form;
import play.db.ebean.Transactional;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.information.infos;
import views.html.information.infoAdds;

/**
 * @author lyz
 *
 */
public class InfoController extends Controller {
	
	/**
	 * 获取详细信息
	 * @return
	 */
	public static Result info_get(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("id");
		
		if(sid == null || sid.length()==0){
	    	return ok();
		}
		
		JsonNode json = Info.getInfo(Long.valueOf(sid));
		return ok(json);
	}
	
	/**
	 * 根据类型获取分页信息列表
	 * @return
	 */
	public static Result info_getByType(){
		DynamicForm in = Form.form().bindFromRequest();
		String typeId = in.get("typeId");
		int limit = Integer.valueOf(in.get("limit"));
		int offset = Integer.valueOf(in.get("offset"));
		String isPicture = in.get("isPicture");
		
		if(typeId == null || typeId.length()==0){
	    	return ok();
		}
		
		JsonNode json = Info.getInfoByType(Long.valueOf(typeId),limit,offset,isPicture);
		return ok(json);
	}
	
	
	///////////////////////////////////////////////////////////////
	
	
	
	
	/**
	 * 获取html页面
	 */
	@Pattern("info_html")
	public static Result info_html() {
		return ok(infos.render());
	}
	
	/**
	 * 获取分页列表
	 * @return
	 */
	@Pattern("info_html")
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
	 * 获取添加页面
	 */
	@Pattern("info_html")
	public static Result infoAdd_html() {
		DynamicForm in = Form.form().bindFromRequest();
		String id = in.get("id");
		String tabId = in.get("tabId");
		String reId = "";
		if(id != null && id.length() != 0){
			reId = id;
		}
		return ok(infoAdds.render(reId,tabId));
	}
	
	/**
	 * 添加
	 */
	@Pattern("info_html")
	@Transactional
	public static Result info_add(){  
		String user_id = Controller.session("id");
		
		DynamicForm in = Form.form().bindFromRequest();
		String title = in.get("title");
		String remark = in.get("remark");
		String type_id = in.get("type_id");
		String content = in.get("content");
		
		JsonNode json;
		if(title == null || title.length()==0
				||remark == null || remark.length()==0
				||type_id == null || type_id.length()==0
				||content == null || content.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		Info info = new Info();
		info.title = title;
		info.remark = remark;
		
		InfoType infoType = new InfoType();
		infoType.id = Long.valueOf(type_id);
		info.infoType = infoType;
		
		info.content = content;
		info.picture = null;
		
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
	@Pattern("info_html")
	@Transactional
	public static Result info_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String title = in.get("title");
		String remark = in.get("remark");
		String type_id = in.get("type_id");
		String content = in.get("content");
		
		JsonNode json;
		if(sid == null || sid.length()==0
				||title == null || title.length()==0
				||remark == null || remark.length()==0
				||type_id == null || type_id.length()==0
				||content == null || content.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		Info info = new Info();
		info.id = Integer.valueOf(sid);
		info.title = title;
		info.remark = remark;
		
		InfoType infoType = new InfoType();
		infoType.id = Long.valueOf(type_id);
		info.infoType = infoType;
		
		info.content = content;
		
		info.lastUpdateTime = new Date();

		info.updateInfo();
		json = UtilTool.message(0, "修改成功!");

		return ok(json);
	}
	
	/**
	 * 删除
	 * @return
	 */
	@Pattern("info_html")
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
	@Pattern("info_html")
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
	@Pattern("info_html")
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
