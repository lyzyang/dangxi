package controllers.fundmanagement;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import be.objectify.deadbolt.java.actions.Pattern;

import com.fasterxml.jackson.databind.JsonNode;

import models.UtilTool;
import models.fundmanagement.Fund;
import models.fundmanagement.FundType;
import models.userbehavior.AuthorisedUser;
import play.data.DynamicForm;
import play.data.Form;
import play.db.ebean.Transactional;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.fundmanagement.funds;
import views.html.fundmanagement.fundAdds;

/**
 * @author lyz
 *
 */
public class FundController extends Controller {
	
	/**
	 * 获取基金信息
	 * @return
	 */
	public static Result fund_get(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("id");
		
		if(sid == null || sid.length()==0){
	    	return ok();
		}
		
		JsonNode json = Fund.getFund(Long.valueOf(sid));
		return ok(json);
	}
	
	
	/**
	 * 根据类型获取分页基金列表
	 * @return
	 */
	public static Result fund_getByType(){
		DynamicForm in = Form.form().bindFromRequest();
		String typeId = in.get("typeId");
		int limit = Integer.valueOf(in.get("limit"));
		int offset = Integer.valueOf(in.get("offset"));
		
		if(typeId == null || typeId.length()==0){
	    	return ok();
		}
		
		JsonNode json = Fund.getFundByType(Long.valueOf(typeId),limit,offset);
		return ok(json);
	}
	
	/**
	 * 获取基金统计信息
	 * @return
	 */
	public static Result fund_getStat(){
		DynamicForm in = Form.form().bindFromRequest();
		String typeId = in.get("typeId");
		
		if(typeId == null || typeId.length()==0){
	    	return ok();
		}
		
		String[][] mo = getLast12Months();
		JsonNode json = Fund.getFundStat(mo,Integer.valueOf(typeId));
		return ok(json);
	}
	
	
	//////////////////////////////////////////
	
	
	
	
	/**
	 * 获取html页面
	 */
	@Pattern("fund_html")
	public static Result fund_html() {
		return ok(funds.render());
	}
	
	/**
	 * 获取分页列表
	 * @return
	 */
	@Pattern("fund_html")
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
	 * 获取添加页面
	 */
	@Pattern("fund_html")
	public static Result fundAdd_html() {
		DynamicForm in = Form.form().bindFromRequest();
		String id = in.get("id");
		String tabId = in.get("tabId");
		String reId = "";
		if(id != null && id.length() != 0){
			reId = id;
		}
		return ok(fundAdds.render(reId,tabId));
	}
	
	
	/**
	 * 添加
	 */
	@Pattern("fund_html")
	@Transactional
	public static Result fund_add(){  
		String user_id = Controller.session("id");
		
		DynamicForm in = Form.form().bindFromRequest();
		String title = in.get("title");
		String fundType_id = in.get("fundType_id");
		String type = in.get("type");
		String amount = in.get("amount");
		Date useTime = UtilTool.stringToDate(in.get("useTime"));
		String content = in.get("content");
		
		JsonNode json;
		if(title == null || title.length()==0
				||fundType_id == null || fundType_id.length()==0
				||type == null || type.length()==0
				||amount == null || amount.length()==0
				||useTime == null
				||content == null || content.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		double damount;
		try {
			damount = Double.valueOf(amount);
		} catch (NumberFormatException e) {
			json = UtilTool.message(1, "请输入数字！");
	    	return ok(json);
		}
		if(damount < 0){
			json = UtilTool.message(1, "请输入正数金额！");
	    	return ok(json);
		}
		
		Fund fund = new Fund();
		fund.title = title;
		
		FundType fundType = new FundType();
		fundType.id = Long.valueOf(fundType_id);
		fund.fundType = fundType;
		
		fund.type = Integer.valueOf(type);
		fund.amount = damount;
		fund.useTime = useTime;
		fund.content = content;
		
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
	@Pattern("fund_html")
	@Transactional
	public static Result fund_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String sid = in.get("sid");
		String title = in.get("title");
		String fundType_id = in.get("fundType_id");
		String type = in.get("type");
		String amount = in.get("amount");
		Date useTime = UtilTool.stringToDate(in.get("useTime"));
		String content = in.get("content");
		
		JsonNode json;
		if(sid == null || sid.length()==0
				||title == null || title.length()==0
				||fundType_id == null || fundType_id.length()==0
				||type == null || type.length()==0
				||amount == null || amount.length()==0
				||useTime == null
				||content == null || content.length()==0){
			json = UtilTool.message(1, "请将信息填写完整！");
	    	return ok(json);
		}
		
		double damount;
		try {
			damount = Double.valueOf(amount);
		} catch (NumberFormatException e) {
			json = UtilTool.message(1, "请输入数字！");
	    	return ok(json);
		}
		if(damount < 0){
			json = UtilTool.message(1, "请输入正数金额！");
	    	return ok(json);
		}
		
		Fund fund = new Fund();
		fund.id = Long.valueOf(sid);
		fund.title = title;
		
		FundType fundType = new FundType();
		fundType.id = Long.valueOf(fundType_id);
		fund.fundType = fundType;
		
		fund.type = Integer.valueOf(type);
		fund.amount = damount;
		fund.content = content;
		
		fund.useTime = useTime;
		fund.lastUpdateTime = new Date();
		
		fund.updateFund();
		json = UtilTool.message(0, "修改成功!");

		return ok(json);
	}
	
	/**
	 * 删除
	 * @return
	 */
	@Pattern("fund_html")
	@Transactional
	public static Result fund_del(){
		DynamicForm in = Form.form().bindFromRequest();
		String id_array =in.get("id_array");
		
		JsonNode json;
		new Fund().delFund(id_array);
		json = UtilTool.message(0, "删除成功!");
		
		return ok(json);
	}
	
	
	/**
	 * 获取最近12个月
	 * @return
	 * @throws ParseException 
	 */
	public static String[][] getLast12Months(){  
        String[][] last12Months = new String[12][2];  
          
        Calendar cal = Calendar.getInstance();  
        cal.set(Calendar.MONTH, cal.get(Calendar.MONTH)+1); //要先+1,才能把本月的算进去</span>  
        for(int i=0; i<12; i++){  
            try {
				cal.set(Calendar.MONTH, cal.get(Calendar.MONTH)-1); //逐次往前推1个月  
				last12Months[11-i][0] = cal.get(Calendar.YEAR)+ "-" + (cal.get(Calendar.MONTH)+1); 
				
				Calendar calendar = new GregorianCalendar(); 
				Date date = UtilTool.year_mouth.parse(last12Months[11-i][0]); 
				calendar.setTime(date); //放入你的日期 
				last12Months[11-i][1] = "" + calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
			} catch (ParseException e) {
				e.printStackTrace();
			}
        }  
        return last12Months;  
    }  
}
