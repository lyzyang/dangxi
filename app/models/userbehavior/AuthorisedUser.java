package models.userbehavior;

import be.objectify.deadbolt.core.models.Permission;
import be.objectify.deadbolt.core.models.Role;
import be.objectify.deadbolt.core.models.Subject;
import play.data.DynamicForm;
import play.data.Form;
import play.db.ebean.Model;
import play.mvc.Controller;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import models.UtilTool;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.annotation.Transactional;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.ArrayList;
import java.util.List;

/**
 * @author lyz
 */
@Entity
public class AuthorisedUser extends Model implements Subject {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	public long id;
	
	public String authuser;
	public String password;
	public String userName;
	public String email;
    
    @ManyToMany
    public List<SecurityRole> roles;
    
    
    public static final Finder<Long, AuthorisedUser> finder = new Finder<Long, AuthorisedUser>(Long.class, AuthorisedUser.class);
    
    public AuthorisedUser() {}
    public AuthorisedUser(long id) {
    	this.id = id;
    }
    public AuthorisedUser(String id) {
		this.id = Long.parseLong(id);
	}
	@Override
    public String getIdentifier(){
        return authuser;
    }
    
    @Override
    public List<? extends Role> getRoles(){
        return roles;
    }

	@SuppressWarnings("unchecked")
	@Override
    public List<? extends Permission> getPermissions(){
    	boolean isadmin = false;
    	List<UserPermission> userpermissions_list = new ArrayList<UserPermission>();
    	for(SecurityRole role : roles){
    		if(role.isadmin == 1) isadmin = true;
    	}
    	if(isadmin){
    		userpermissions_list = UserPermission.finder.where().findList();
    	}else{
    		for(SecurityRole role : roles){
        		userpermissions_list.addAll(role.permissions);
        		userpermissions_list = UtilTool.removeDuplicate(userpermissions_list);
        	}
    	}
       return userpermissions_list;
    }

	/**
	 * 获取用户的权限列表
	 * @return
	 */
    @SuppressWarnings("unchecked")
	public List<UserPermission> getUserPermissionList(){
    	boolean isadmin = false;
    	List<UserPermission> userpermissions_list = new ArrayList<UserPermission>();
    	for(SecurityRole role : roles){
    		if(role.isadmin == 1) isadmin = true;
    	}
    	if(isadmin){
    		userpermissions_list = UserPermission.finder.where().findList();
    	}else{
    		for(SecurityRole role : roles){
        		userpermissions_list.addAll(role.permissions);
        		userpermissions_list = UtilTool.removeDuplicate(userpermissions_list);
        	}
    	}
       return userpermissions_list;
    }
    

    
    
    /**
     * 根据user的id获取user拥有的角色
     * @param mould_id
     * @return
     */
	public JsonNode getUserRole_json(long user_id){
    	AuthorisedUser user = finder.byId(user_id);
    	List<SecurityRole> roles_list = user.roles;
    	
    	ObjectMapper mapper = new ObjectMapper(); 
		ObjectNode json = mapper.createObjectNode ();  
		ArrayNode sr_array = mapper.createArrayNode (); 
    	for(SecurityRole sr : roles_list){
    		ObjectNode appJson = mapper.createObjectNode ();  
    		appJson.put("id", sr.id);
    		sr_array.add(appJson);
    	}
    	json.put("roles", sr_array);
    	return json;
    }
    
	
    
    @Transactional
    public void addAuthorisedUser(){
    	this.save();
    }
    
    @Transactional
    public void upAuthorisedUser(){
    	this.update();
    }
    
    @Transactional
    public void delAuthorisedUser(String id_array){
    	String[] array = id_array.split(",");
    	List<SecurityRole> roles_list = new ArrayList<SecurityRole>();
		for(String id: array){
			AuthorisedUser user = finder.byId(Long.valueOf(id));
			
			user.roles = roles_list;
	    	user.update();
	    	user.delete();
		}
    }
        
}
