package models.information;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import com.avaje.ebean.Query;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import models.UtilTool;
import models.userbehavior.AuthorisedUser;
import play.db.ebean.Model;

/**
 * @author lyz
 */
@Entity
public class Info extends Model{

	 /**
		 * 
		 */
		private static final long serialVersionUID = 1L;
		
		@Id
		public long id;
		
		public String title;
		public String remark;
		
		@ManyToOne
		public InfoType infoType;
		
		@Lob
		public String content;
		
		@Lob
		public String picture;
		
		@ManyToOne
		public AuthorisedUser user;
		
		public Date createTime;
		public Date lastUpdateTime;
		
		@Column(columnDefinition="int4 default 1")
		public int type; //0隐藏 1显示
		
		public static final Finder<Long, Info> finder = new Finder<Long, Info>(Long.class, Info.class);
		
		
		public static JsonNode getInfo(long id){
			Info info = finder.byId(id);
			ObjectMapper mapper = new ObjectMapper();
			ObjectNode appJson = mapper.createObjectNode();
			appJson.put("id", info.id);
			appJson.put("title", info.title);
			appJson.put("remark", info.remark);
			appJson.put("infoType_id", info.infoType.id);
			appJson.put("infoType_name", info.infoType.name);
			appJson.put("user_userName", info.user.userName);
			appJson.put("createTime",  UtilTool.DateToString(info.createTime));
			appJson.put("lastUpdateTime", UtilTool.DateToString(info.lastUpdateTime));
			return appJson;
		}
		
		
		public static JsonNode getInfoPageJson(int limit,int offset,String order,String sort,String search,String infoType_id){
			Query<Info> query = finder.query();
			if(sort != null && sort.length() != 0){
				sort = sort.replace("_", ".");
				query.where().orderBy(sort +" "+ order);
			}else{
				query.where().orderBy("createTime asc");
			}
			
			if(infoType_id !=null && infoType_id.length() != 0){
				InfoType it = new InfoType();
				it.id = Integer.valueOf(infoType_id);
				query.where().eq("infoType", it);
			}
			
			if(search != null && search.length() != 0) {
				query.where().disjunction()
					.like("title", "%" + search + "%")
					.like("remark", "%" + search + "%")
					.like("infoType.name", "%" + search + "%")
					.like("content", "%" + search + "%")
					.like("user.userName", "%" + search + "%");
			}

			int info_list_size = query.findRowCount();
			List<Info> info_list = query.where().setFirstRow(offset).setMaxRows(limit).findList();
			
			ObjectMapper mapper = new ObjectMapper();
			ObjectNode json = mapper.createObjectNode ();
			json.put("total", info_list_size);
			ArrayNode array = mapper.createArrayNode ();
			for(Info info : info_list){
				ObjectNode appJson = mapper.createObjectNode();
				appJson.put("id", info.id);
				appJson.put("title", info.title);
				appJson.put("remark", info.remark);
				appJson.put("infoType_id", info.infoType.id);
				appJson.put("infoType_name", info.infoType.name);
				appJson.put("user_userName", info.user.userName);
				appJson.put("createTime",  UtilTool.DateToString(info.createTime));
				appJson.put("lastUpdateTime", UtilTool.DateToString(info.lastUpdateTime));
				array.add(appJson);
			}
			json.put("rows", array);
			return json;
		}
		
		
		public void addInfo(){
			this.save();
		}
		
		public void updateInfo(){
			this.update();
		}
		
		public void delInfo(String id_array){
			String[] array = id_array.split(",");
			for(String id: array){
				Info info = finder.byId(Long.valueOf(id));
				info.delete();
			}
		}
}
