package controllers.userbehavior;

import java.util.ArrayList;
import java.util.List;

import models.UtilTool;
import models.userbehavior.AuthorisedUser;
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
import views.html.userbehavior.securityRoles;

/**
 * @author lyz
 */
public class SecurityRoleController extends Controller{
	
	
	/**
	 * 获取部门列表
	 * @return
	 */
	@SubjectPresent
	public static Result securityRole_json(){
		JsonNode json = SecurityRole.getSecurityRoleJson();
		return ok(json);
	}
	
	
	/**
	 * 获取html页面
	 * @return
	 */
	@Pattern("securityRole_html")
	public static Result securityRole_html(){
		return ok(securityRoles.render());
	}
	

	/**
	 * 获取全部有效的权限列表
	 * @return
	 */
	@Pattern("securityRole_html")
	public static Result securityRole_permissions_json(){
		JsonNode RolePermissions_json = UserPermission.getAllValidPermissionsJson();
		return ok(RolePermissions_json);
	}

	
	/**
	 * 根据role_id获取role所拥有的权限和菜单列表
	 * @return
	 */
	@Pattern("securityRole_html")
	public static Result securityRole_has_permissions(){
		DynamicForm in = Form.form().bindFromRequest();
		long sid = Long.valueOf(in.get("sid"));
		JsonNode json = UserPermission.getRolePermissions(sid);
		return ok(json);
	}
	
	
	
	
	/**
	 * 添加管理组
	 * @return
	 */
	@Pattern("securityRole_html")
	@Transactional
	public static Result securityRole_add(){
		DynamicForm in = Form.form().bindFromRequest();
		
		String name = in.get("name");
		if(name == null|| name.length() == 0 ){
			return ok(UtilTool.message(1, "请填写角色名！"));
		}
		
		SecurityRole sr = new SecurityRole();
		sr.sort = SecurityRole.finder.findRowCount();
		sr.name = name;
		sr.isadmin = 0;
		
		JsonNode json;

		JsonNode js = sr.addSecurityRole();
		json = UtilTool.message(0, "添加成功!",js);
	
		return ok(json);
	}
	
	/**
	 * 修改管理组
	 * @return
	 */
	@Pattern("securityRole_html")
	@Transactional
	public static Result securityRole_up(){
		DynamicForm in = Form.form().bindFromRequest();
		
		String id = in.get("sid");
		String name = in.get("name");
		
		if(id == null|| id.length() == 0 ||
				name == null|| name.length() == 0){
			return ok(UtilTool.message(1, "传入数据异常！"));
		}
		
		SecurityRole sr = SecurityRole.finder.byId(Long.valueOf(id));
		sr.name = name;
		
		JsonNode json;
		JsonNode js = sr.upSecurityRole();
		json = UtilTool.message(0, "修改成功!",js);

		return ok(json);
	}
	
	/**
	 * 删除管理组
	 * @return
	 */
	@Pattern("securityRole_html")
	@Transactional
	public static Result securityRole_del(){
		DynamicForm in = Form.form().bindFromRequest();
		
		String sid = in.get("sid");
		
		if(sid == null|| sid.length() == 0){
			return ok(UtilTool.message(1, "传入数据异常！"));
		}
		
		SecurityRole role = SecurityRole.finder.byId(Long.valueOf(sid));
		
		List<AuthorisedUser> user_list = AuthorisedUser.finder.where().eq("roles", role).findList();
    	if(user_list.size()!=0){
    		return ok(UtilTool.message(1, "有用户正在使用该职位！"));
    	}
		
		JsonNode json;

		role.delSecurityRole();
		json = UtilTool.message(0, "删除成功!");
	
		return ok(json);
	}
	
	/**
	 * 更新管理组属性,是否有效
	 * @return
	 */
	@Pattern("securityRole_html")
	@Transactional
	public static Result securityRole_oc_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String str = in.get("str");
		String[] spm = str.split("&");
		
		JsonNode json;

		for(String smc : spm){
			String[] mc = smc.split("_");
			long id = Long.valueOf(mc[0]);
			//long pId = Long.valueOf(mc[1]);
			//int checked = Integer.valueOf(mc[2]);
			int sort = Integer.valueOf(mc[3]);
			SecurityRole securityRole = SecurityRole.finder.byId(id);
			if(sort != -1) securityRole.sort = sort;
			securityRole.update();
		}
		json = UtilTool.message(0, "更新成功!");
		
		return ok(json);
	}
	
	/**
	 * 更新管理组权限
	 * @return
	 */
	@Pattern("securityRole_html")
	@Transactional
	public static Result securityRole_perm_up(){
		DynamicForm in = Form.form().bindFromRequest();
		long sid = Long.valueOf(in.get("sid"));
		String str = in.get("str");
		String[] permissions_id = {};
		if(str.length() != 0){
			permissions_id = str.split("&");
		} 
		ArrayList<UserPermission> permissions_list =  new ArrayList<UserPermission>();
		for(String permission_id : permissions_id){
			UserPermission up = new UserPermission();
			up.id = Integer.valueOf(permission_id);
			permissions_list.add(up);
		}
		
		SecurityRole srole = SecurityRole.finder.byId(sid);
		srole.permissions = permissions_list;
		
		JsonNode json;

		srole.update();
		json = UtilTool.message(0, "更新成功!");
	
		return ok(json);
	}
	
}
