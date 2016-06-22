package controllers.userbehavior;

import java.util.List;

import models.UtilTool;
import models.userbehavior.SecurityRole;
import models.userbehavior.UserPermission;
import be.objectify.deadbolt.java.actions.Pattern;
import be.objectify.deadbolt.java.actions.SubjectPresent;

import com.fasterxml.jackson.databind.JsonNode;

import play.data.DynamicForm;
import play.data.Form;
import play.db.ebean.Transactional;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.userbehavior.userPermissions;

/**
 * @author lyz
 */
public class UserPermissionController extends Controller{
	
	
	/**
	 * 获取菜单，用于网页显示
	 * @return
	 */
	@SubjectPresent
	public static Result page_menu(){
		String id = Controller.session("id");
		int index_user_id = Integer.valueOf(id);
		JsonNode json = UserPermission.getPageMenu(index_user_id);
		return ok(json);
	}
	
	
	/**
	 * 获取html页面
	 * @return
	 */
	@Pattern("userPermission_html")
	public static Result userPermission_html(){
		return ok(userPermissions.render());
	}
	
	/**
	 * 获取权限列表
	 * @return
	 */
	@Pattern("userPermission_html")
	public static Result userPermission_json(){
		JsonNode json = UserPermission.getUserPermissionJson();
		return ok(json);
	}
	
	/**
	 * 添加权限
	 * @return
	 */
	@Pattern("userPermission_html")
	@Transactional
	public static Result userPermission_add(){
		DynamicForm in = Form.form().bindFromRequest();
		UserPermission up = new UserPermission();
		
		int pid_id = Integer.valueOf(in.get("pId"));
		if(pid_id != 0 ){
			UserPermission pid = new UserPermission();
			pid.id = pid_id;
			up.pid = pid;
		}
		
		up.checked = 0;
		up.sort = UserPermission.finder.findRowCount();
		
		up.name = in.get("name");
		up.iconClass = in.get("iconClass");
		
		int ismenu = Integer.valueOf(in.get("ismenu"));
		up.ismenu = ismenu;
		if(ismenu == 0 ){
			up.value = "";
		}else{
			up.value = in.get("value");
		}
		
		JsonNode json;
		JsonNode js = up.addUserPermission();
		json = UtilTool.message(0, "添加成功!",js);
		
       return ok(json);
	}
	
	/**
	 * 修改权限
	 * @return
	 */
	@Pattern("userPermission_html")
	@Transactional
	public static Result userPermission_up(){
		DynamicForm in = Form.form().bindFromRequest();
		UserPermission up = UserPermission.finder.byId(Long.valueOf(in.get("sid")));
		up.name = in.get("name");
		up.iconClass = in.get("iconClass");
		
		int ismenu = Integer.valueOf(in.get("ismenu"));
		up.ismenu = ismenu;
		if(ismenu == 0 ){
			up.value = "";
		}else{
			up.value = in.get("value");
		}

		JsonNode json;

		JsonNode js = up.upUserPermission();
		json = UtilTool.message(0, "修改成功!",js);
		
       return ok(json);
	}
	
	/**
	 * 删除权限
	 * @return
	 */
	@Pattern("userPermission_html")
	@Transactional
	public static Result userPermission_del(){
		DynamicForm in = Form.form().bindFromRequest();
		long sid = Long.valueOf(in.get("sid"));
		UserPermission up = UserPermission.finder.byId(sid);
		
		JsonNode json;

		up.delUserPermission();
		json = UtilTool.message(0, "删除成功!");
	
       return ok(json);
	}
	
	/**
	 * 修改权限顺序，从属，是否有效
	 * @return
	 */
	@Pattern("userPermission_html")
	@Transactional
	public static Result userPermission_oc_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String str = in.get("str");
		String[] spm = str.split("&");
		
		JsonNode json;
	
		for(String smc : spm){
			String[] mc = smc.split("_");
			long id = Long.valueOf(mc[0]);
			long pId = Long.valueOf(mc[1]);
			int checked = Integer.valueOf(mc[2]);
			int sort = Integer.valueOf(mc[3]);
			UserPermission userPermission = UserPermission.finder.byId(id);
			
			if(pId != -1){ 
				if(pId == 0){ 
					userPermission.pid = null;
				} else{
					UserPermission up = new UserPermission();
					up.id = pId;
					userPermission.pid = up;
				}
			} 
			
			if(checked != -1){
				userPermission.checked = checked;
				if(checked == 0){
					List<SecurityRole> role_list = userPermission.securityroles;
					for(SecurityRole role : role_list){
						List<UserPermission> up_list = role.permissions;
						up_list.remove(userPermission);
						role.permissions = up_list;
						role.update();
					}
				}
			} 
			if(sort != -1) userPermission.sort = sort;
			userPermission.update();
		}
		json = UtilTool.message(0, "更新成功!");
	
       return ok(json);
	}
}
