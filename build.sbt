import com.github.play2war.plugin._

name := "dangxi"

version := "dev"

libraryDependencies ++= Seq(
  javaJdbc,
  javaEbean,
  cache,
  filters,
  "org.postgresql" % "postgresql" % "9.4-1204-jdbc41",
  "commons-io" % "commons-io" % "2.2",
  "org.apache.poi" % "poi" % "3.12",
  "org.apache.poi" % "poi-examples" % "3.12",
  "org.apache.poi" % "poi-excelant" % "3.12",
  "org.apache.poi" % "poi-ooxml" % "3.12",
  "org.apache.poi" % "poi-ooxml-schemas" % "3.12",
  "org.apache.poi" % "poi-scratchpad" % "3.12",
  "org.springframework.security" % "spring-security-core" % "3.1.0.RELEASE",
  "be.objectify" %% "deadbolt-java" % "2.2.1"
)     


Play2WarPlugin.play2WarSettings

Play2WarKeys.explodedJar := true

Play2WarKeys.disableWarningWhenWebxmlFileFound := true

Play2WarKeys.servletVersion := "3.0"

Play2WarKeys.targetName := Some("ROOT")

play.Project.playJavaSettings

closureCompilerOptions += "ecmascript5"

playAssetsDirectories <+= baseDirectory / "upload"
 