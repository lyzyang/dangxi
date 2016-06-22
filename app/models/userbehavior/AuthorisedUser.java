package models.userbehavior;

import be.objectify.deadbolt.core.models.Permission;
import be.objectify.deadbolt.core.models.Role;
import be.objectify.deadbolt.core.models.Subject;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import models.UtilTool;

import com.avaje.ebean.Query;
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
	  * 获取管理员列表
	  * @param limit
	  * @param offset
	  * @param order
	  * @param sort
	  * @param search
	  * @return
	  */
	public static JsonNode getAuthorisedUserPageJson(int limit,int offset,String order,String sort,String search){
		Query<AuthorisedUser> query = finder.query();
		if(sort != null && sort.length() != 0){
			sort = sort.replace("_", ".");
			query.where().orderBy(sort +" "+ order);
		}else{
			query.where().orderBy("id asc");
		}
		
		if(search != null && search.length() != 0) {
			query.where().disjunction()
				.like("userName", "%" + search + "%")
				.like("user", "%" + search + "%")
				.like("email", "%" + search + "%")
				.like("roles.name", "%" + search + "%");
		}
		query.where().eq("roles.isadmin", 0);

		int authorisedUser_list_size = query.findRowCount();
		List<AuthorisedUser> authorisedUser_list = query.where().setFirstRow(offset).setMaxRows(limit).findList();
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode ();
		json.put("total", authorisedUser_list_size);
		ArrayNode array = mapper.createArrayNode ();
		for(AuthorisedUser au : authorisedUser_list){
			ObjectNode appJson = mapper.createObjectNode ();
			appJson.put("id", au.id);
			appJson.put("userName", au.userName);
			appJson.put("user", au.authuser);
			appJson.put("email", au.email);
			
			String roleId = "";
			String roleName = "";
			for(SecurityRole role : au.roles){
				roleId = roleId + role.id + ",";
				roleName = roleName + role.name + ",";
			}
			if(roleId.length()!=0) appJson.put("roleId", roleId.substring(0, roleId.length()-1));
			else appJson.put("roleId", roleId);
			
			if(roleName.length()!=0) appJson.put("roleName", roleName.substring(0, roleName.length()-1));
			else appJson.put("roleName", roleName);
			
			array.add(appJson);
		}
		json.put("rows", array);
		return json;
	}
  
    
    public void addAuthorisedUser(){
    	this.save();
    }
    
    public void upAuthorisedUser(){
    	this.update();
    }
    
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
