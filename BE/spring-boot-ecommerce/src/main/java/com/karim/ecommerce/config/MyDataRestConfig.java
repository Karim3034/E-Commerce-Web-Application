package com.karim.ecommerce.config;

import com.karim.ecommerce.entity.Country;
import com.karim.ecommerce.entity.Product;
import com.karim.ecommerce.entity.ProductCategory;
import com.karim.ecommerce.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.swing.text.html.HTML;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer{
    EntityManager entityManager;
    @Autowired
    public MyDataRestConfig(EntityManager entityManager){
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod [] unSupportedActions = {HttpMethod.POST,HttpMethod.PUT,HttpMethod.DELETE,HttpMethod.PATCH};
        disableHttpMethods(Product.class,config, unSupportedActions);
        disableHttpMethods(ProductCategory.class,config,unSupportedActions);
        disableHttpMethods(Country.class,config,unSupportedActions);
        disableHttpMethods(State.class,config,unSupportedActions);
        
        cors.addMapping("/api/**").allowedOrigins("http://localhost:4200");
        //config.exposeIdsFor(ProductCategory.class);
        exposeId(config);
    }

    private static void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] unSupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(unSupportedActions)))
                .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(unSupportedActions)));
    }

    private void exposeId(RepositoryRestConfiguration config) {

        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        List<Class> entityClass = new ArrayList<>();
        for(EntityType<?> entityType:entities){
            entityClass.add(entityType.getJavaType());
        }
        Class[] domainTypes = entityClass.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
