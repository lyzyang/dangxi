package models.fundmanagement;

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
public class Fund extends Model{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	public long id;
	
	@ManyToOne
	public FundType fundType;
	
	@Column(columnDefinition="int4 default 0")
	public int type;//0支出 1收入
	
	@Column(columnDefinition="float8 default 0")
	public Double amount;
	
	public String title;
	
	@Lob
	public String content;
	
	public Date useTime;
	
	@ManyToOne
	public AuthorisedUser user;
	
	public Date createTime;
	public Date lastUpdateTime;
	
	public static final Finder<Long, Fund> finder = new Finder<Long, Fund>(Long.class, Fund.class);
	
	/**
	 * 获取详细
	 * @param id
	 * @return
	 */
	public static JsonNode getFund(long id){
		Fund fund = finder.byId(id);
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode appJson = mapper.createObjectNode();
		appJson.put("id", fund.id);
		appJson.put("title", fund.title);
		
		appJson.put("fundType_id", fund.fundType.id);
		appJson.put("fundType_name", fund.fundType.name);
		
		appJson.put("type", fund.type);
		String type_name = "";
		if(fund.type == 1) type_name = "收入";
		else type_name = "支出";
		
		appJson.put("type_name", type_name);
		appJson.put("remark", type_name + fund.amount);
		
		appJson.put("amount", fund.amount);
		appJson.put("useTime",  UtilTool.DateToString(fund.useTime));
		appJson.put("content", fund.content);
		
		appJson.put("user_userName", fund.user.userName);
		appJson.put("createTime",  UtilTool.DateToString(fund.createTime));
		return appJson;
	}
	
	/**
	 * 统计信息
	 * @param mo
	 * @param typeId
	 * @return
	 */
	public static JsonNode getFundStat(String[][] mo, int typeId){
		FundType fundType = new FundType();
		fundType.id = typeId;
		
		String ymd_frist = mo[0][0] + "-" + 1 +" "+"00:00:00";
		Date frist = UtilTool.stringToDate(ymd_frist);
		List<Fund> old_fund_list = finder.where().lt("useTime", frist).eq("fundType", fundType).findList();
		
		double old_total = 0;
		for(Fund old_fund : old_fund_list){
			if(old_fund.type == 0)
				old_total = old_total - old_fund.amount;
			
			if(old_fund.type == 1)
				old_total = old_total + old_fund.amount;
		}
		
		double total = old_total;
		double all_in = 0;
		double all_out = 0;
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode();
		
		ArrayNode month_stat_array = mapper.createArrayNode ();
		ArrayNode month_stat_in_array = mapper.createArrayNode ();
		ArrayNode month_stat_out_array = mapper.createArrayNode ();
		for(int i=0;i<12;i++){
			String ymd_begin = mo[i][0] + "-" + 1 +" "+"00:00:00";
			String ymd_end = mo[i][0] + "-" + mo[i][1] +" "+"23:59:59";
			
			Date begin = UtilTool.stringToDate(ymd_begin);
			Date end = UtilTool.stringToDate(ymd_end);
			List<Fund> fund_list = finder.where().between("useTime", begin, end).eq("fundType", fundType).findList();
			
			double in = 0, out = 0;
			for(Fund fund : fund_list){
				if(fund.type == 0){
					total = total - fund.amount;
					out = out - fund.amount;
				}
				
				if(fund.type == 1){
					total = total + fund.amount;
					in = in + fund.amount;
				}
			}
			all_in = all_in + in;
			all_out = all_out + out;
			
			ArrayNode month_stat_data = mapper.createArrayNode();
			month_stat_data.add(mo[i][0]);
			month_stat_data.add(total);
			month_stat_array.add(month_stat_data);
			
			ArrayNode month_stat_in_data = mapper.createArrayNode();
			month_stat_in_data.add(mo[i][0]);
			month_stat_in_data.add(in);
			month_stat_in_array.add(month_stat_in_data);
			
			ArrayNode month_stat_out_data = mapper.createArrayNode();
			month_stat_out_data.add(mo[i][0]);
			month_stat_out_data.add(-out);
			month_stat_out_array.add(month_stat_out_data);
		}
		
		json.put("all_total", total);
		json.put("all_in", all_in);
		json.put("all_out", -all_out);
		
		json.put("month_stat", month_stat_array);
		json.put("month_stat_in", month_stat_in_array);
		json.put("month_stat_out", month_stat_out_array);
		
		return json;
	}
	
	/**
	 * 类型分页列表
	 * @param typeId
	 * @param limit
	 * @param offset
	 * @return
	 */
	public static JsonNode getFundByType(long typeId,int limit,int offset){
		Query<Fund> query = finder.query();
		
		FundType fundType = new FundType();
		fundType.id = typeId;
		
		query.where().eq("fundType", fundType).orderBy("useTime desc");
		
		int fund_list_size = query.findRowCount();
		List<Fund> fund_list = query.setFirstRow(offset).setMaxRows(limit).findList();
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode ();
		json.put("total", fund_list_size);
		ArrayNode array = mapper.createArrayNode ();
		for(Fund fund : fund_list){
			ObjectNode appJson = mapper.createObjectNode();
			appJson.put("id", fund.id);
			appJson.put("title", fund.title);
			
			appJson.put("type", fund.type);
			String type_name = "";
			if(fund.type == 1) type_name = "收入";
			else type_name = "支出";
			
			appJson.put("type_name", type_name);
			appJson.put("remark", type_name + fund.amount);
			
			appJson.put("amount", fund.amount);
			
			appJson.put("useTime",  UtilTool.DateToYNRString(fund.useTime));
			array.add(appJson);
		}
		json.put("rows", array);
		return json;
	}
	
	
	/**
	 * 分页列表
	 * @param limit
	 * @param offset
	 * @param order
	 * @param sort
	 * @param search
	 * @param type
	 * @param fundType_id
	 * @return
	 */
	public static JsonNode getFundPageJson(int limit,int offset,String order,String sort,String search,
			String type,String fundType_id){
		Query<Fund> query = finder.query();
		if(sort != null && sort.length() != 0){
			sort = sort.replace("_", ".");
			query.where().orderBy(sort +" "+ order);
		}else{
			query.where().orderBy("useTime desc");
		}
		
		if(type !=null && type.length() != 0){
			query.where().eq("type", Integer.valueOf(type));
		}
		
		if(fundType_id !=null && fundType_id.length() != 0){
			FundType ft = new FundType();
			ft.id = Integer.valueOf(fundType_id);
			query.where().eq("fundType", ft);
		}
		
		if(search != null && search.length() != 0) {
			query.where().disjunction()
				.like("remark", "%" + search + "%")
				.like("user.userName", "%" + search + "%");
		}

		int fund_list_size = query.findRowCount();
		List<Fund> fund_list = query.where().setFirstRow(offset).setMaxRows(limit).findList();
		
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode json = mapper.createObjectNode ();
		json.put("total", fund_list_size);
		ArrayNode array = mapper.createArrayNode ();
		for(Fund fund : fund_list){
			ObjectNode appJson = mapper.createObjectNode();
			appJson.put("id", fund.id);
			appJson.put("title", fund.title);
			appJson.put("fundType_id", fund.fundType.id);
			appJson.put("fundType_name", fund.fundType.name);
			
			appJson.put("type", fund.type);
			String type_name = "";
			if(fund.type == 1) type_name = "收入";
			else type_name = "支出";
			
			appJson.put("type_name", type_name);
			appJson.put("remark", type_name + fund.amount);
			
			appJson.put("amount", fund.amount);
			
			appJson.put("user_userName", fund.user.userName);
			appJson.put("useTime",  UtilTool.DateToString(fund.useTime));
			appJson.put("createTime",  UtilTool.DateToString(fund.createTime));
			
			array.add(appJson);
		}
		json.put("rows", array);
		return json;
	}
	
	
	public void addFund(){
		this.save();
	}
	
	public void updateFund(){
		this.update();
	}
	
	public void delFund(String id_array){
		String[] array = id_array.split(",");
		for(String id: array){
			Fund fund = finder.byId(Long.valueOf(id));
			fund.delete();
		}
	}
}
