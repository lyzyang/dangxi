package models;

import java.awt.Image;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.imageio.ImageIO;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.StandardPasswordEncoder;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class UtilTool {

	public final static Logger logger = LoggerFactory.getLogger(UtilTool.class); 
	
	private static final String SITE_WIDE_SECRET = "9cdb1c265a0258d";  
	public static final PasswordEncoder encoder = new StandardPasswordEncoder(SITE_WIDE_SECRET); 
	
	public static final SimpleDateFormat year_mouth_dd = new SimpleDateFormat("yyyy-MM-dd");
	public static final SimpleDateFormat year_mouth_dd_time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	/**
	 * 去除list里相同的内容
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static List removeDuplicate(List list) {
		Set set = new HashSet();
		List newList = new ArrayList();
		for (Iterator iter = list.iterator(); iter.hasNext();) {
			Object element = iter.next();
			if (set.add(element))
				newList.add(element);
		}
		return newList;
	}
	

	/**
	 * 页面提示信息
	 * @param status 状态
	 * @param mess 信息
	 * @return json object
	 */
	public static ObjectNode message(int status, String mess) {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode jsonNode = mapper.createObjectNode();
		jsonNode.put("status", status);
		jsonNode.put("mess", mess);
		return jsonNode;

	}
	/**
	 * 页面提示信息
	 * @param status 状态
	 * @param mess 信息
	 * @return json object
	 */
	public static ObjectNode message(int status, String mess,JsonNode js) {
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode jsonNode = mapper.createObjectNode();
		jsonNode.put("status", status);
		jsonNode.put("mess", mess);
		jsonNode.put("js", js);
		return jsonNode;

	}
	
	/**
	 * 判断是否是图片
	 * @param imageFile
	 * @return
	 */
	public static boolean isImage(File file) {  
	    if (!file.exists()) {  
	        return false;  
	    }  
	    Image img = null;  
	    try {  
	        img = ImageIO.read(file);  
	        if (img == null || img.getWidth(null) <= 0 || img.getHeight(null) <= 0) {  
	            return false;  
	        }  
	        return true;  
	    } catch (Exception e) {  
	        return false;  
	    } finally {  
	        img = null;  
	    }  
	}  
    
    /**
     * 文件转换成字符串
     * @param file
     * @return
     */
    public static String fileToString(File file){
    	Base64 encoder = new Base64();
    	String str = encoder.encodeAsString(fileToByte(file));
    	return str;
    }
    
    /**
     * 文件转换成二进制码
     * @param file
     * @return
     */
    public static byte[] fileToByte(File file) {
        byte[] by = new byte[(int) file.length()];
        InputStream is = null;
        try {
            is = new FileInputStream(file);
            ByteArrayOutputStream bytestream = new ByteArrayOutputStream();
            byte[] bb = new byte[2048];
            int ch;
            ch = is.read(bb);
            while (ch != -1) {
                bytestream.write(bb, 0, ch);
                ch = is.read(bb);
            }
            by = bytestream.toByteArray();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally{
        	try {
        		if(is != null) is.close();
			} catch (IOException e) {}
         }
        return by;
    }
    
    
    /**
     * 二进制码转换成文件
     * @param file
     * @return
     */
    public static void byteToFile(byte[] buf, String filePath, long id){  
		BufferedOutputStream bos = null;
		FileOutputStream fos = null;
		File file = null;
		try {
			File dir = new File(filePath);
			if (!dir.exists()) {
				dir.mkdirs();
			}
			file = new File(filePath + File.separator + id);
			fos = new FileOutputStream(file);
			bos = new BufferedOutputStream(fos);
			bos.write(buf);
		} catch (Exception e) {
			logger.error("false",e);
		} finally {
			if (bos != null) {
				try {
					bos.close();
				} catch (IOException e) {
				}
			}
			if (fos != null) {
				try {
					fos.close();
				} catch (IOException e) {
				}
			}
		}
    }  
	
    /**
	 * 将时间转换为2015-06-19格式
	 */
	public static String DateToYNRString(Date date) {
		if(date == null) return null;
		return year_mouth_dd.format(date);
	}
	
	/**
	 * 将时间转换为2015-06-19 11:38:13格式
	 */
	public static String DateToString(Date date) {
		if(date == null) return null;
		return year_mouth_dd_time.format(date);
	}
	public static String DateToString(long date) {
		return year_mouth_dd_time.format(date);
	}
	
	/**
	 * 将long型或者2015-06-19 11:38:13格式字符串转换为时间
	 * @return 失败返回null
	 */
	public static Date stringToDate(String str) {
		try {
			long time = Long.parseLong(str);
			return new Date(time);
		} catch(Exception e) {
			try {
				return (Date) year_mouth_dd_time.parseObject(str);
			} catch (Exception e1) {}
		}
		return null;
	}

	/**
	 * 时间差
	 * @param diff
	 * @return
	 */
	public static String LongToDuration(long diff){
		long days = diff / (1000 * 60 * 60 * 24);
		long hours = (diff-days*(1000 * 60 * 60 * 24))/(1000* 60 * 60);
		long minutes = (diff-days*(1000 * 60 * 60 * 24)-hours*(1000* 60 * 60))/(1000* 60);
		long seconds = (diff-days*(1000 * 60 * 60 * 24)-hours*(1000* 60 * 60)-minutes*(1000*60))/1000;
		return ""+days+"天"+hours+"小时"+minutes+"分"+seconds+"秒"; 
	}
}


