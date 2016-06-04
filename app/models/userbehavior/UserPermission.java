
package models.userbehavior;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import be.objectify.deadbolt.core.models.Permission;
import play.db.ebean.Model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;

import models.UtilTool;

import com.avaje.ebean.annotation.Transactional;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * @author lyz
 */
@Entity
public class UserPermission extends Model implements Permission {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
    public long id;
	
	@OneToOne
	public UserPermission pid;
	
	@Column(columnDefinition="int4 default 0")
	public Integer checked;  //0无效  1有效
	
	@Column(columnDefinition="int4 default 0")
	public Integer sort;
	
	public String iconClass;
	public String name;
	public String value;
	
	@Column(columnDefinition="int4 default 0")
    public Integer ismenu; //0目录  1菜单 2权限
    
    @ManyToMany(mappedBy="permissions")
    public List<SecurityRole> securityroles;
    
    public static final Model.Finder<Long, UserPermission> finder = new Model.Finder<Long, UserPermission>(Long.class,
                                                                                                         UserPermission.class);
    @Override
    public String getValue(){
        return value;
    }

    public static UserPermission getUserPermission(String value,Integer ismenu){
    	return finder.where().eq("value", value).eq("ismenu", ismenu).findUnique();
    }
    
    
    /**
	 * 获取菜单，用于网页显示
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static JsonNode getPageMenu(long index_user_id){
		List<UserPermission> up_list = new ArrayList<UserPermission>();
		AuthorisedUser index_user = AuthorisedUser.finder.byId(index_user_id);
		
		boolean isadmin = false;
    	for(SecurityRole sr : index_user.roles){
    		if(sr.isadmin == 1) isadmin = true;
    	}
    	
		if(isadmin){
			up_list = finder.where().orderBy("sort asc").findList();
		}else{
			for(SecurityRole sr: index_user.roles){
				up_list.addAll(sr.permissions);
			}
			up_list = UtilTool.removeDuplicate(up_list);
			System.setProperty("java.util.Arrays.useLegacyMergeSort", "true");
			Collections.sort(up_list, new Comparator<UserPermission>() {  
    			@Override
    			public int compare(UserPermission o1, UserPermission o2) {
    				int id1 = o1.sort;
    				int id2 = o2.sort;
    				if(id1 < id2){
    					return -1;
    				}else{
    					return 1;
    				}
    			}  
            }); 
		}
		
		List<UserPermission> temp_list = new ArrayList<UserPermission>();
		temp_list.addAll(up_list);
		for(UserPermission up :up_list){
			if(up.ismenu != 1){
				temp_list.remove(up);
			}
		}
		up_list = temp_list;
		
		ObjectMapper mapper = new ObjectMapper();
		ArrayNode array = mapper.createArrayNode ();

		for(UserPermission up :up_list){
			ObjectNode appJson = up.toJson();
			appJson.put("url", up.value);
			array.add(appJson);
		}

		return array;
	}

	
    /**
     * 获取权限列表,系统数据管理
     * @return
     */
    public static JsonNode getUserPermissionJson(){
		List<UserPermission> UserPermission_list = finder.orderBy("sort asc").findList();
		ObjectMapper mapper = new ObjectMapper();
		ArrayNode array = mapper.createArrayNode ();
		for(UserPermission up : UserPermission_list){
			array.add(up.toJson());
		}
		return array;
	}
   
    
    
    /**
     * 获取当前有效的权限列表，管理组
     * @param index_user_id
     * @return
     */
	public static ArrayNode getAllValidPermissionsJson(){
    	List<UserPermission> UserPermission_list = new ArrayList<UserPermission>();
    	UserPermission_list = finder.where().eq("checked", 1).orderBy("sort asc").findList();
    	ObjectMapper mapper = new ObjectMapper();
		ArrayNode array = mapper.createArrayNode ();
		for(UserPermission up : UserPermission_list){
			array.add(up.toJson());
		}
		return array;
    }
    
	
	/**
     * 根据id获取role所拥有的权限和菜单列表
     * @param id
     * @return
     */
    public static JsonNode getRolePermissions(long id){
    	SecurityRole sr = SecurityRole.finder.byId(id);
		List<UserPermission> permissions_list = sr.permissions;
		
		ObjectMapper mapper = new ObjectMapper(); 
		ObjectNode json = mapper.createObjectNode ();  
		ArrayNode up_array = mapper.createArrayNode (); 
    	for(UserPermission up : permissions_list){
			ObjectNode appJson = mapper.createObjectNode ();  
    		appJson.put("id", up.id);
    		up_array.add(appJson);
    	}
    	json.put("permissions", up_array);
    	
    	return json;
    }
	
	
    
    
	
	
    /**
     * 添加权限并返回添加的权限的JSON
     * @param up
     * @return
     */
    @Transactional
    public JsonNode addUserPermission(){
    	this.save();
    	return this.toJson();
    }
    
    /**
     * 修改权限并返回添加的删除的JSON
     * @param up
     * @return
     */
    @Transactional
    public JsonNode upUserPermission(){
    	this.update();
    	return this.toJson();
    }
    
    /**
     * 删除权限，以及相关联的信息
     * @param id
     */
    @Transactional
    public void delUserPermission(){
    	List<SecurityRole> sl = SecurityRole.finder.where().eq("permissions", this).findList();
    	for(SecurityRole role: sl){
    		role.permissions.remove(this);
    		role.update();
    	}
    	this.delete();
    }
    
    /**
     * 转换成json
     * @return
     */
    public ObjectNode toJson(){
    	ObjectMapper mapper = new ObjectMapper();
    	ObjectNode appJson = mapper.createObjectNode ();
    	appJson.put("id", this.id);
    	
    	if(this.pid != null) appJson.put("pId", this.pid.id);
		else appJson.put("pId", 0 );
    	
		appJson.put("sort", this.sort);
		
		boolean i = false;
		if(this.checked==1) i = true; 
		appJson.put("checked", i);
		
		appJson.put("name", this.name);
		appJson.put("value", this.value);
		appJson.put("iconClass", this.iconClass);
		appJson.put("ismenu", this.ismenu);
		
		return appJson;
    }
}
