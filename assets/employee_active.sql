SELECT e.id, e."name", 

	(SELECT 
    CASE WHEN m."movimentType" = 'Nomeação' THEN true
         WHEN m."movimentType" = 'Exoneração' THEN false
    END 
    FROM "Moviment" m
    WHERE m.number = 
    (SELECT MAX(m2.number) FROM "Moviment" m2 WHERE m2."employeeId"  = m."employeeId" GROUP BY m2."employeeId")
     AND (m."employeeId" = e.id)
     LIMIT 1
  ) AS Ativo

FROM "Employee" e
ORDER BY e.name;
