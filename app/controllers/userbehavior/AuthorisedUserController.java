package controllers.userbehavior;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import models.UtilTool;
import models.userbehavior.AuthorisedUser;
import models.userbehavior.SecurityRole;
import play.data.DynamicForm;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import be.objectify.deadbolt.java.actions.Pattern;
import be.objectify.deadbolt.java.actions.SubjectPresent;
import views.html.userbehavior.authorisedUsers;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * @author lyz
 */
public class AuthorisedUserController extends Controller{

	private final static Logger logger = LoggerFactory.getLogger(AuthorisedUserController.class); 
	
	/**
	 * 修改用户名
	 * @return
	 */
	@SubjectPresent
	public static Result user_name_up(){
		String id = Controller.session("id");
		long index_user_id = Long.valueOf(id);
		
		DynamicForm in = Form.form().bindFromRequest();
		String name = in.get("name");
		String email = in.get("email");
		AuthorisedUser user = AuthorisedUser.finder.byId(index_user_id);
		user.userName = name;
		user.email = email;
		
		JsonNode json;
		try {
			user.upAuthorisedUser();
			json = UtilTool.message(0, "修改成功!");
		} catch (Exception e) {
			logger.error("false",e);
			json = UtilTool.message(1, "修改失败!");
		}
    	return ok(json);
	}
	
	/**
	 * 修改用户密码
	 * @return
	 */
	@SubjectPresent
	public static Result user_pass_up(){
		String id = Controller.session("id");
		long index_user_id = Long.valueOf(id);
		
		DynamicForm in = Form.form().bindFromRequest();
		String oldpass = in.get("oldpass");
		String newpass = in.get("newpass");
		String qnewpass = in.get("qnewpass");
		
		JsonNode json;
		if(oldpass.length()==0||newpass.length()==0||qnewpass.length()==0){
			json = UtilTool.message(1, "密码不能为空！");
	    	return ok(json);
		}
		
		if(!newpass.equals(qnewpass)){
			json = UtilTool.message(1, "新密码两次输入不相同!");
	    	return ok(json);
		}
		
		AuthorisedUser user = AuthorisedUser.finder.byId(index_user_id);
		if(!UtilTool.encoder.matches(oldpass, user.password)){
			json = UtilTool.message(1, "旧密码输入错误！");
	    	return ok(json);
		}
		user.password = UtilTool.encoder.encode(newpass);;
		
		try {
			user.upAuthorisedUser();
			json = UtilTool.message(0, "修改成功!");
		} catch (Exception e) {
			logger.error("false",e);
			json = UtilTool.message(1, "修改失败!");
		}
    	return ok(json);
	}
	
	
	/**
	 * 获取html页面
	 * @return
	 */
	@Pattern("authorisedUser_html")
	public static Result authorisedUser_html(){
		return ok(authorisedUsers.render());
	}
	
	/**
	 * 分页显示admin
	 * @return
	 */
	@Pattern("authorisedUser_html")
	public static Result authorisedUser_page_json(){
		DynamicForm in = Form.form().bindFromRequest();
		int limit = Integer.valueOf(in.get("limit"));
		int offset = Integer.valueOf(in.get("offset"));
		String order = in.get("order");
		String sort = in.get("sort");
		String search = in.get("search");
		JsonNode useradmin_page_json = AuthorisedUser.getAuthorisedUserPageJson(limit, offset, order, sort, search);
		return ok(useradmin_page_json);
	}
	

	/**
	 * 添加管理员
	 * @return
	 */
	@Pattern("authorisedUser_html")
	public static Result authorisedUser_add(){
		DynamicForm in = Form.form().bindFromRequest();
		String userName = in.get("userName");
		String user = in.get("user");
		String email = in.get("email");
		String password = in.get("password");
		String roles = in.get("roles_id");
		
		if(userName.length()==0||user.length()==0||roles.length()==0){
			return ok(UtilTool.message(1, "请将用户信息填写完整！"));
		}
		
		AuthorisedUser au = AuthorisedUser.finder.where().eq("authuser", user).findUnique();
		if(au != null){
			return ok(UtilTool.message(1, "已存在用户"+user+"!"));
		}
		
		AuthorisedUser authorisedUser = new AuthorisedUser();
		authorisedUser.userName = userName;
		authorisedUser.authuser = user;
		authorisedUser.email = email;
		
		if(password.length() == 0){
			password = "123456";
		}
		authorisedUser.password = UtilTool.encoder.encode(password);
		String[] role = roles.split(",");
		List<SecurityRole> roles_list = new ArrayList<SecurityRole>();
		for(String id : role){
			SecurityRole sr = new SecurityRole();
			int i = Integer.valueOf(id);
			if(i>0) sr.id = i;
			else sr.id = -i;
			roles_list.add(sr);
		}
		authorisedUser.roles = roles_list;
		
		JsonNode json;
		try {
			authorisedUser.addAuthorisedUser();
			json = UtilTool.message(0, "添加成功!");
		} catch (Exception e) {
			logger.error("false",e);
			json = UtilTool.message(1, "添加失败!");
		}
		
		return ok(json);
	}
	
	/**
	 * 修改管理员
	 * @return
	 */
	@Pattern("authorisedUser_html")
	public static Result authorisedUser_up(){
		DynamicForm in = Form.form().bindFromRequest();
		String id = in.get("sid");
		String userName = in.get("userName");
		String user = in.get("user");
		String email = in.get("email");
		String password = in.get("password");
		String roles = in.get("roles_id");
		
		if(id.length()==0 || userName.length()==0||user.length()==0||roles.length()==0){
			return ok(UtilTool.message(1, "请将用户信息填写完整！"));
		}
	
		AuthorisedUser au = new AuthorisedUser();
		au.id = Integer.valueOf(id);
		au.userName = userName;
		au.authuser = user;
		au.email = email;
		
		if(password != null && password.length() != 0){
			password = UtilTool.encoder.encode(password);
			au.password = password;
		}
		
		String[] role = roles.split(",");
		List<SecurityRole> roles_list = new ArrayList<SecurityRole>();
		for(String role_id : role){
			SecurityRole sr = new SecurityRole();
			sr.id = Integer.valueOf(role_id);
			roles_list.add(sr);
		}
		au.roles = roles_list;
		
		JsonNode json;
		try {
			au.upAuthorisedUser();
			json = UtilTool.message(0, "修改成功!");
		} catch (Exception e) {
			logger.error("false",e);
			json = UtilTool.message(1, "修改失败!");
		}
		return ok(json);
	}
	
	/**
	 * 删除管理员
	 * @return
	 */
	@Pattern("authorisedUser_html")
	public static Result authorisedUser_del(){
		DynamicForm in = Form.form().bindFromRequest();
		String id_array = in.get("id_array");
		JsonNode json;
		try {
			new AuthorisedUser().delAuthorisedUser(id_array);
			json = UtilTool.message(0, "删除成功!");
		} catch (Exception e) {
			logger.error("false",e);
			json = UtilTool.message(1, "删除失败!");
		}
		return ok(json);
	}
}
