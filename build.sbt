import com.github.play2war.plugin._

name := "dangxi"

version := "dev"

libraryDependencies ++= Seq(
  javaJdbc,
  javaEbean,
  cache,
  filters,
  "mysql" % "mysql-connector-java" % "5.1.39",
  "commons-io" % "commons-io" % "2.2",
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
 