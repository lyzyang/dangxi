package controllers;

import models.fundmanagement.FundType;
import models.information.InfoType;
import play.data.DynamicForm;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.main;
import views.html.more_info;
import views.html.header;
import views.html.item_info;
import views.html.item_fund;
import views.html.more_fund;

public class Application extends Controller{

	/**
	 * 主页头
	 * @return
	 */
	public static Result header() {
		return ok(header.render());
    }
	
	/**
	 * 主页主题
	 * @return
	 */
	public static Result main() {
		return ok(main.render());
    }
	
	/**
	 * 主页更多
	 * @return
	 */
	public static Result more_info() {
		DynamicForm in = Form.form().bindFromRequest();
		String infoTypeId = in.get("infoTypeId");
		String advertSetId = in.get("advertSetId");
		InfoType it = InfoType.finder.byId(Long.valueOf(infoTypeId));
		return ok(more_info.render(it.id,it.name,advertSetId));
    }
	
	/**
	 * 文章内容
	 * @return
	 */
	public static Result item_info() {
		DynamicForm in = Form.form().bindFromRequest();
		String infoId = in.get("infoId");
		return ok(item_info.render(infoId));
    }
	
	
	/**
	 * 主页更多
	 * @return
	 */
	public static Result more_fund() {
		DynamicForm in = Form.form().bindFromRequest();
		String fundTypeId = in.get("fundTypeId");
		String advertSetId = in.get("advertSetId");
		FundType ft = FundType.finder.byId(Long.valueOf(fundTypeId));
		return ok(more_fund.render(ft.id,ft.name,advertSetId));
    }
	
	/**
	 * 文章内容
	 * @return
	 */
	public static Result item_fund() {
		DynamicForm in = Form.form().bindFromRequest();
		String fundId = in.get("fundId");
		return ok(item_fund.render(fundId));
    }
}
