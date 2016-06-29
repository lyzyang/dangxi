package controllers.fundmanagement;


import com.fasterxml.jackson.databind.JsonNode;

import models.UtilTool;
import models.fundmanagement.FundType;
import play.data.DynamicForm;
import play.data.Form;
import play.db.ebean.Transactional;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.fundmanagement.fundTypes;

/**
 * @author lyz
 *
 */
public class FundTypeController extends Controller {
	
	
	
	public static Result fundType_json() {
		JsonNode json = FundType.getFundTypeJson();
		return ok(json);
	}
	
	
	/**
	 * 获取html页面
	 */
	public static Result fundType_html() {
		return ok(fundTypes.render());
	}
	
	
	public static Result fundType_page_json() {
		DynamicForm in = Form.form().bindFromRequest();
		int limit = Integer.valueOf(in.get("limit"));
		int offset = Integer.valueOf(in.get("offset"));
		String order = in.get("order");
		String sort = in.get("sort");
		String search = in.get("search");
		
		JsonNode json = FundType.getFundTypePageJson(limit,offset,order,sort,search);
		return ok(json);
	}
	
	
	/**
	 * 添加
	 */
	@Transactional
	public static Result fundType_add(){  
		DynamicForm in = Form.form().bindFromRequest();
		String name = in.get("name");
		
		JsonNode json;
		if(name == null || name.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		FundType fundType = new FundType();
		fundType.name = name;

		fundType.addFundType();
		json = UtilTool.message(0, "添加成功!");

    	return ok(json);
	}
	
	/**
	 * 修改
	 * @return
	 */
	@Transactional
	public static Result fundType_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String name = in.get("name");
		
		JsonNode json;
		if(sid == null || sid.length()==0
				|| name == null || name.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		FundType fundType = FundType.finder.byId(Long.valueOf(sid));
		fundType.name = name;
		
		fundType.updateFundType();
		json = UtilTool.message(0, "修改成功!");

		return ok(json);
	}
	
	/**
	 * 删除
	 * @return
	 */
	@Transactional
	public static Result fundType_del(){
		DynamicForm in = Form.form().bindFromRequest();
		String id_array =in.get("id_array");
		
		JsonNode json;

		new FundType().delFundType(id_array);
		json = UtilTool.message(0, "删除成功!");
		
		return ok(json);
	}
	
}
