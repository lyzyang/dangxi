package controllers.admanage;


import be.objectify.deadbolt.java.actions.Pattern;

import com.fasterxml.jackson.databind.JsonNode;

import models.UtilTool;
import models.admanage.Advert;
import play.data.DynamicForm;
import play.data.Form;
import play.db.ebean.Transactional;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.admanage.advertTypes;

/**
 * @author lyz
 *
 */
public class AdvertTypeController extends Controller {
	
	
	/**
	 * 获取html页面
	 */
	@Pattern("advertType_html")
	public static Result advertType_html() {
		return ok(advertTypes.render());
	}
	
	/**
	 * 分页列表
	 * @return
	 */
	@Pattern("advertType_html")
	public static Result advertType_page_json() {
		DynamicForm in = Form.form().bindFromRequest();
		int limit = Integer.valueOf(in.get("limit"));
		int offset = Integer.valueOf(in.get("offset"));
		String order = in.get("order");
		String sort = in.get("sort");
		String search = in.get("search");
		
		JsonNode json = Advert.getAdvertPageJson(limit,offset,order,sort,search);
		return ok(json);
	}
	
	
	/**
	 * 添加
	 */
	@Pattern("advertType_html")
	@Transactional
	public static Result advertType_add(){  
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String name = in.get("name");
		
		JsonNode json;
		if(sid == null || sid.length()==0
				||name == null || name.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		Advert advertType = new Advert();
		advertType.id = Long.valueOf(sid);
		advertType.name = name;

		advertType.addAdvert();
		json = UtilTool.message(0, "添加成功!");

    	return ok(json);
	}
	
	/**
	 * 修改
	 * @return
	 */
	@Pattern("advertType_html")
	@Transactional
	public static Result advertType_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String name = in.get("name");
		
		JsonNode json;
		if(sid == null || sid.length()==0
				|| name == null || name.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		Advert advertType = Advert.finder.byId(Long.valueOf(sid));
		advertType.name = name;
		
		advertType.updateAdvert();
		json = UtilTool.message(0, "修改成功!");

		return ok(json);
	}
	
	/**
	 * 删除
	 * @return
	 */
	@Pattern("advertType_html")
	@Transactional
	public static Result advertType_del(){
		DynamicForm in = Form.form().bindFromRequest();
		String id_array =in.get("id_array");
		
		JsonNode json;

		new Advert().delAdvert(id_array);
		json = UtilTool.message(0, "删除成功!");
		
		return ok(json);
	}
	
}
