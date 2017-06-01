 package security;

import java.util.Map;

import controllers.userbehavior.LoginController;
import models.UtilTool;
import models.userbehavior.AuthorisedUser;
import be.objectify.deadbolt.core.models.Subject;
import be.objectify.deadbolt.java.AbstractDeadboltHandler;
import play.cache.Cache;
import play.libs.F;
import play.libs.F.Promise;
import play.mvc.Http;
import play.mvc.Controller;
import play.mvc.SimpleResult;
import views.html.login;

/**
 * @author lyz
 *
 */
public class MyDeadboltHandler extends AbstractDeadboltHandler
{

    public F.Promise<SimpleResult> beforeAuthCheck(Http.Context context){
        return F.Promise.pure(null);
    }

	public Subject getSubject(Http.Context context) {
		String id = checkuser();
		if (id.equals("no")||id.equals("other")||id.equals("outtime"))
			return null;
		
		AuthorisedUser user = AuthorisedUser.finder.byId(Long.valueOf(id));
		return user;
		
		/*long id = 58L;//84 58  73
		LoginController.setCacheSession((new Long(System.currentTimeMillis())).toString(),String.valueOf(id));
		AuthorisedUser user = AuthorisedUser.finder.byId(id);
		return user;*/
	}
  

    @Override
	public Promise<SimpleResult> onAuthFailure(final Http.Context context, String content) {
		return F.Promise.promise(new F.Function0<SimpleResult>() {
			@Override
			public SimpleResult apply() throws Throwable {
				String id = checkuser();
				
				String restring = "";
				if(id.equals("no"))
					restring = "请先登录！";
				else if(id.equals("other"))
					restring = "帐号在异地登录！";
				else if(id.equals("outtime"))
					restring = "登录已超时！";
				else
					restring = "没有权限！";
				
				if(context.request().path().equals("/index"))
					return ok(login.render(restring));
				else
					return ok(UtilTool.message(1,restring));
			}
		});
	}
    
	public static String checkuser(){
		String id = Controller.session("id");
		String current = Controller.session("current");
		
		if (id == null || current ==null)
			return "no";
		
		@SuppressWarnings("unchecked")
		Map<String,String> map_cache = (Map<String,String>)Cache.get(id);
		if (map_cache == null)
			return "no";
		
		String cache_current = map_cache.get("current");
		if(!current.equals(cache_current))
			return "other";
		
		double cache_dotime = Double.valueOf(map_cache.get("dotime"));
		String nowdotime = (new Long(System.currentTimeMillis())).toString();
		double now_dotime = Double.valueOf(nowdotime);
		
		if((now_dotime-cache_dotime)/(60*60*60)>60)
			return "outtime";
		else{
			map_cache.put("dotime", nowdotime);
			Cache.set(id, map_cache);
		}
			
		return id;
	}
	
}
