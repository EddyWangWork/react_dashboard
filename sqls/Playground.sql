---------------SQL Playground

--------------------item detail (bar chart)
select 
	final.DateMonth, 
	sum(case when final.DSTypeID = 1 then final.Amount else 0 end) as credit,
	sum(case when final.DSTypeID = 2 then final.Amount else 0 end) as debit,
	sum(case when final.DSTypeID = 1 then final.Amount else - final.Amount end) as diff
from
(
select 
	case 
		when a.DSItemSubID = 0
			then b.Name
			else bb.Name
		end
		as Name
	,a.Description
	,a.DSTypeID
	,MONTH(CreatedDateTime) as DateMonth
	,a.Amount	
from 
	DSTransaction a
	left join DSItem b on b.ID = a.DSItemID
	left join DSItemSub c on c.ID = a.DSItemSubID
	left join DSItem bb on bb.ID = c.DSItemID
where 
	a.DSTypeID in (1,2) 
	and YEAR(CreatedDateTime) = 2023 
	--and MONTH(CreatedDateTime) in (1,2,3,4,5,6,7)
) final
group by final.DateMonth
order by DateMonth

--------------------group by final.Name, self compare type
select 
	final.DateMonth, 
	sum(case when final.DSTypeID = 1 then final.Amount else 0 end) as credit,
	sum(case when final.DSTypeID = 2 then final.Amount else 0 end) as debit,
	sum(case when final.DSTypeID = 1 then final.Amount else - final.Amount end) as diff
from
(
select 
	case 
		when a.DSItemSubID = 0
			then b.Name
			else bb.Name
		end
		as Name
	,a.Description
	,a.DSTypeID
	,MONTH(CreatedDateTime) as DateMonth
	,a.Amount	
from 
	DSTransaction a
	left join DSItem b on b.ID = a.DSItemID
	left join DSItemSub c on c.ID = a.DSItemSubID
	left join DSItem bb on bb.ID = c.DSItemID
where 
	a.DSTypeID in (1,2) 
	and YEAR(CreatedDateTime) = 2023 
	--and MONTH(CreatedDateTime) in (1,2,3,4,5,6,7)
) final
group by final.DateMonth
order by DateMonth

---------------group by final.Name, final.DateMonth (line chart2)
select 
	*,
	case when a.name is null then 0 else Amount end as amount
from
(
select 	
	final.DateMonth as dateMonth,
	final.Name as name,
	SUM(final.Amount) as Amount
from
(
select 
	case 
		when a.DSItemSubID = 0
			then b.Name
			else bb.Name
		end
		as Name
	,a.Description
	,a.DSTypeID
	,MONTH(CreatedDateTime) as DateMonth
	,a.Amount	
from 
	DSTransaction a
	left join DSItem b on b.ID = a.DSItemID
	left join DSItemSub c on c.ID = a.DSItemSubID
	left join DSItem bb on bb.ID = c.DSItemID
where 
	a.DSTypeID in (2) 
	and YEAR(CreatedDateTime) = 2023 
	and MONTH(CreatedDateTime) in (11)
) final
group by final.Name, final.DateMonth
) a
right join
(
select b.name from 
(
select 		
	distinct final.Name as name
from
(
select 
	case 
		when a.DSItemSubID = 0
			then b.Name
			else bb.Name
		end
		as Name
	,a.Description
	,a.DSTypeID
	,MONTH(CreatedDateTime) as DateMonth
	,a.Amount	
from 
	DSTransaction a
	left join DSItem b on b.ID = a.DSItemID
	left join DSItemSub c on c.ID = a.DSItemSubID
	left join DSItem bb on bb.ID = c.DSItemID
where 
	a.DSTypeID in (2) 
	and YEAR(CreatedDateTime) = 2023
) final
group by final.Name, final.DateMonth
)b
) bb on bb.name = a.name

---------------group by final.Name, final.DateMonth (line chart)
select 
	final.DateMonth, 
	final.DSTypeID, 
	SUM(final.Amount) as Amount
from
(
select 
	case 
		when a.DSItemSubID = 0
			then b.Name
			else bb.Name
		end
		as Name
	,a.Description
	,a.DSTypeID
	,MONTH(CreatedDateTime) as DateMonth
	,a.Amount	
from 
	DSTransaction a
	left join DSItem b on b.ID = a.DSItemID
	left join DSItemSub c on c.ID = a.DSItemSubID
	left join DSItem bb on bb.ID = c.DSItemID
where 
	a.DSTypeID in (1,2) 
	and YEAR(CreatedDateTime) = 2023 
	--and MONTH(CreatedDateTime) in (1,2,3)
) final
group by final.DateMonth, final.DSTypeID
order by DateMonth

---------------group by final.Name, final.DateMonth (compare by month)
select 
	final.Name, final.DateMonth, SUM(final.Amount) as Amount
from
(
select 
	case 
		when a.DSItemSubID = 0
			then b.Name
			else bb.Name
		end
		as Name
	,a.DSTypeID
	,MONTH(CreatedDateTime) as DateMonth
	,a.Amount	
from 
	DSTransaction a
	left join DSItem b on b.ID = a.DSItemID
	left join DSItemSub c on c.ID = a.DSItemSubID
	left join DSItem bb on bb.ID = c.DSItemID
where 
	a.DSTypeID in (2) and
	YEAR(CreatedDateTime) = 2023 and
	MONTH(CreatedDateTime) in (1,2,3)
) final
group by final.Name, final.DateMonth
order by final.Name

---------------group by DSTypeID, Name (Piechart)
select 
DSTypeID, Name, sum(a.Amount) as amount
from
(
	select 
		case 
			when a.DSItemSubID = 0
				then b.Name
				else bb.Name
			end
			as Name
		,a.Amount
		,a.DSTypeID
		--,*
	from 
		DSTransaction a
		left join DSItem b on b.ID = a.DSItemID
		left join DSItemSub c on c.ID = a.DSItemSubID
		left join DSItem bb on bb.ID = c.DSItemID
	where 
		a.DSTypeID in (1,2) and
		YEAR(CreatedDateTime) = 2023 and
		MONTH(CreatedDateTime) = 7
) a
group by DSTypeID, Name

---------------
select 
	*
	--final.DateMonth, final.DSTypeID, SUM(final.Amount) as Amount
from
(
select 
	case 
		when a.DSItemSubID = 0
			then b.Name
			else bb.Name
		end
		as Name
	,a.Description
	,a.DSTypeID
	,MONTH(CreatedDateTime) as DateMonth
	,a.Amount	
from 
	DSTransaction a
	left join DSItem b on b.ID = a.DSItemID
	left join DSItemSub c on c.ID = a.DSItemSubID
	left join DSItem bb on bb.ID = c.DSItemID
where 
	a.DSTypeID in (2) 
	and YEAR(CreatedDateTime) = 2023 
	--and MONTH(CreatedDateTime) in (1,2,3)
) final
--group by final.DateMonth, final.DSTypeID
order by DateMonth