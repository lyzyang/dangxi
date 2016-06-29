package controllers.fundmanagement;

import java.util.Date;

import com.fasterxml.jackson.databind.JsonNode;

import models.UtilTool;
import models.fundmanagement.Fund;
import models.fundmanagement.FundType;
import models.information.Info;
import models.userbehavior.AuthorisedUser;
import play.data.DynamicForm;
import play.data.Form;
import play.db.ebean.Transactional;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.fundmanagement.funds;

/**
 * @author lyz
 *
 */
public class FundController extends Controller {
	
	
	/**
	 * 获取html页面
	 */
	public static Result fund_html() {
		return ok(funds.render());
	}
	
	
	public static Result fund_page_json() {
		DynamicForm in = Form.form().bindFromRequest();
		int limit = Integer.valueOf(in.get("limit"));
		int offset = Integer.valueOf(in.get("offset"));
		String order = in.get("order");
		String sort = in.get("sort");
		String search = in.get("search");
		String type = in.get("type");
		String fundType_id = in.get("fundType_id");
		
		JsonNode json = Fund.getFundPageJson(limit,offset,order,sort,search,type,fundType_id);
		return ok(json);
	}
	
	
	/**
	 * 添加
	 */
	@Transactional
	public static Result fund_add(){  
		String user_id = Controller.session("id");
		
		DynamicForm in = Form.form().bindFromRequest();
		String fundType_id = in.get("fundType_id");
		String type = in.get("type");
		String amount = in.get("amount");
		String remark = in.get("remark");
		String info_id = in.get("info_id");
		
		JsonNode json;
		if(fundType_id == null || fundType_id.length()==0
				||type == null || type.length()==0
				||amount == null || amount.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		Fund fund = new Fund();
		
		FundType fundType = new FundType();
		fundType.id = Long.valueOf(fundType_id);
		fund.fundType = fundType;
		
		fund.type = Integer.valueOf(type);
		fund.amount = Double.valueOf(amount);
		fund.remark = remark;
		
		Info info = null;
		if(info_id != null && info_id.length()!=0){
			info = new Info();
			info.id = Long.valueOf(info_id);
		}
		fund.info = info;
		
		AuthorisedUser user = new AuthorisedUser();
		user.id = Integer.valueOf(user_id);
		fund.user = user;
		
		fund.createTime = new Date();
		fund.lastUpdateTime = new Date();

		fund.addFund();
		
		json = UtilTool.message(0, "添加成功!");
	
    	return ok(json);
	}
	
	/**
	 * 修改
	 * @return
	 */
	@Transactional
	public static Result fund_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String fundType_id = in.get("fundType_id");
		String type = in.get("type");
		String amount = in.get("amount");
		String remark = in.get("remark");
		String info_id = in.get("info_id");
		
		
		JsonNode json;
		if(sid == null || sid.length()==0
				||fundType_id == null || fundType_id.length()==0
				||type == null || type.length()==0
				||amount == null || amount.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		
		Fund fund = new Fund();
		fund.id = Long.valueOf(sid);
		
		FundType fundType = new FundType();
		fundType.id = Long.valueOf(fundType_id);
		fund.fundType = fundType;
		
		fund.type = Integer.valueOf(type);
		fund.amount = Double.valueOf(amount);
		fund.remark = remark;
		
		Info info = null;
		if(info_id != null && info_id.length()!=0){
			info = new Info();
			info.id = Long.valueOf(info_id);
		}
		fund.info = info;

		fund.lastUpdateTime = new Date();
		
		fund.updateFund();
		json = UtilTool.message(0, "修改成功!");

		return ok(json);
	}
	
	/**
	 * 删除
	 * @return
	 */
	@Transactional
	public static Result fund_del(){
		DynamicForm in = Form.form().bindFromRequest();
		String id_array =in.get("id_array");
		
		JsonNode json;
		new Fund().delFund(id_array);
		json = UtilTool.message(0, "删除成功!");
		
		return ok(json);
	}
	
}
