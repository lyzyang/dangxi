
package models.userbehavior;

import java.util.ArrayList;
import java.util.List;

import be.objectify.deadbolt.core.models.Role;
import play.db.ebean.Model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * @author lyz
 */
@Entity
public class SecurityRole extends Model implements Role {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
    public long id;
	
	@Column(columnDefinition="int4 default 0")
	public Integer sort;
	
    public String name;
    
    @Column(columnDefinition="int4 default 0")  //普通为 0  超级为 1
    public Integer isadmin;
    
    @ManyToMany
    public List<UserPermission> permissions;
    
    
    public static final Finder<Long, SecurityRole> finder = new Finder<Long, SecurityRole>(Long.class,SecurityRole.class);

    public String getName(){
        return name;
    }
    
    /**
     * 获取部门列表
     * @return
     */
	public static JsonNode getSecurityRoleJson(){
    	List<SecurityRole> SecurityRole_list = finder.where().eq("isadmin",0).orderBy("sort asc").findList();
		ObjectMapper mapper = new ObjectMapper();
		ArrayNode array = mapper.createArrayNode ();
		for(SecurityRole sr : SecurityRole_list){
			array.add(sr.toJson());
		}
		return array;
	}

    
    /**
     * 添加并返回添加的权限的json
     * @param sr
     * @return
     */
    public JsonNode addSecurityRole(){
    	this.save();
    	return this.toJson();
    }
    
    /**
     * 修改并返回修改的权限的json
     * @param sr
     * @return
     */
    public JsonNode upSecurityRole(){
    	this.update();
    	return this.toJson();
    }
    
    /**
     * 根据id删除权限，以及其它相关信息
     * @param id
     */
    public void delSecurityRole(){
    	List<UserPermission> p_list = new ArrayList<UserPermission>();
    	this.permissions = p_list;
    	this.update();
    	
    	this.delete();
    }
    
    
    
    /**
     * 转换成json
     * @return
     */
    public JsonNode toJson(){
    	ObjectMapper mapper = new ObjectMapper();
    	ObjectNode appJson = mapper.createObjectNode ();
    	appJson.put("id", this.id);
    	appJson.put("pId", 0);
		appJson.put("sort", this.sort);
		appJson.put("checked", false);
		appJson.put("name", this.name);
		return appJson;
    }
}
