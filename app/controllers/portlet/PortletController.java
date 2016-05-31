package controllers.portlet;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.portlet.portlets;

/**
 * @author lyz
 *
 */
public class PortletController extends Controller {
	
	
	/**
	 * 获取html页面
	 */
	public static Result portlet_html() {
		return ok(portlets.render());
	}
	
}
