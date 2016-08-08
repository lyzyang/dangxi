package controllers.userbehavior;

import java.util.HashMap;
import java.util.Map;

import be.objectify.deadbolt.java.actions.SubjectPresent;
import models.UtilTool;
import models.userbehavior.AuthorisedUser;
import play.cache.Cache;
import play.data.DynamicForm;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;
import views.html.login;


/**
 * @author lyz
 */
public class LoginController extends Controller{
	
	
	/**
	 * 登录页面
	 * @return
	 */
	public static Result login() {
        return ok(login.render(""));
    }
	
	/**
	 * 首页
	 * @return
	 */
	@SubjectPresent
	public static Result index() {
		String id = Controller.session("id");
		AuthorisedUser user = AuthorisedUser.finder.byId(Long.valueOf(id));
		return ok(index.render(user.userName));
    }

	/**
	 * 登录
	 */
	public static Result loginer() {
		DynamicForm in = Form.form().bindFromRequest();
		String user = in.get("username");
		String password = in.get("password");
		AuthorisedUser au = AuthorisedUser.finder.where().eq("authuser", user).findUnique();
		if(au != null){
			long current = System.currentTimeMillis();
			if(UtilTool.encoder.matches(password, au.password)){
				setCacheSession((new Long(current)).toString(),String.valueOf(au.id));
			   return redirect(routes.LoginController.index());
			}else{
              return ok(login.render("帐号或密码错误!"));
			}
		}else{
			return ok(login.render("帐号或密码错误!"));
		}
    }
	
	/**
	 * 退出
	 */
	public static Result exit(){
		String id = Controller.session("id");
		Cache.remove(id);
		Controller.session().remove("id");
		Controller.session().remove("current");
		
		return ok(UtilTool.message(0, "退出成功！"));
	}

	
	/**
	 * 设置登录后的session和cache
	 * @param id
	 * @param ip
	 * @param type
	 * @param version
	 * @param current
	 */
	public static void setCacheSession(String current, String id){
		Controller.session().put("id", id);
		Controller.session().put("current", current);
		Map<String,String> map_cache= new HashMap<String, String>();
		map_cache.put("id", id);
		map_cache.put("current", current);
		map_cache.put("dotime", current);
		Cache.set(id, map_cache);
	}
}
