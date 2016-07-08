package models.admanage;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;

import com.avaje.ebean.Query;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import play.db.ebean.Model;

/**
 * @author lyz
 */
@Entity
public class Advert extends Model{

	 /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	public long id;
	
	public String name;
	
	@Lob
	public String picture;
	
	public String url;
	
	public static final Finder<Long, Advert> finder = new Finder<Long, Advert>(Long.class, Advert.class);
	
	
	public static JsonNode getAdvertGet(long id){
		Advert advertType = finder.byId(id);
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode appJson = mapper.createObjectNode();
		appJson.put("id", advertType.id);
		appJson.put("name", advertType.name);
		appJson.put("picture", advertType.picture);
		appJson.put("url", advertType.url);
		
		return appJson;
	}
	
	
	public static JsonNode getAdvertPageJson(int limit,int offset,String order,String sort,String search){
		Query<Advert> query = finder.query();
		if(sort != null && sort.length() != 0){
			sort = sort.replace("_", ".");
			query.where().orderBy(sort +" "+ order);
		}else{
			query.where().orderBy("id asc");
		}
		
		if(search != null && search.length() != 0) {
			query.where().disjunction()
				.like("name", "%" + search + "%");
		}

		int advertType_list_size = query.findRowCount();
		List<Advert> advertType_list = query.where().setFirstRow(offset).setMaxRows(limit).findList();
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode ();
		json.put("total", advertType_list_size);
		ArrayNode array = mapper.createArrayNode ();
		for(Advert advertType : advertType_list){
			ObjectNode appJson = mapper.createObjectNode();
			appJson.put("id", advertType.id);
			appJson.put("name", advertType.name);
			appJson.put("picture", advertType.picture);
			appJson.put("url", advertType.url);
			array.add(appJson);
		}
		json.put("rows", array);
		return json;
	}
	
	public void addAdvert(){
		this.save();
	}
	
	public void updateAdvert(){
		this.update();
	}
	
	public void delAdvert(String id_array){
		String[] array = id_array.split(",");
		for(String id: array){
			Advert advertType = finder.byId(Long.valueOf(id));
			advertType.delete();
		}
	}
}
