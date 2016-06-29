package controllers.admanage;


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
	public static Result advertType_html() {
		return ok(advertTypes.render());
	}
	
	
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
	@Transactional
	public static Result advertType_add(){  
		DynamicForm in = Form.form().bindFromRequest();
		String code = in.get("code");
		String name = in.get("name");
		
		JsonNode json;
		if(code == null || code.length()==0
				||name == null || name.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		Advert advertType = new Advert();
		advertType.code = code;
		advertType.name = name;

		advertType.addAdvert();
		json = UtilTool.message(0, "添加成功!");

    	return ok(json);
	}
	
	/**
	 * 修改
	 * @return
	 */
	@Transactional
	public static Result advertType_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String code = in.get("code");
		String name = in.get("name");
		
		JsonNode json;
		if(sid == null || sid.length()==0
				||code == null || code.length()==0
				|| name == null || name.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		Advert advertType = Advert.finder.byId(Long.valueOf(sid));
		advertType.code = code;
		advertType.name = name;
		
		advertType.updateAdvert();
		json = UtilTool.message(0, "修改成功!");

		return ok(json);
	}
	
	/**
	 * 删除
	 * @return
	 */
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
