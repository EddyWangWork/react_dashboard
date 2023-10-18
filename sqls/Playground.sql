---------------SQL Playground

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

---------------

select 
DSTypeID, Name, sum(a.Amount)
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
	,a.DSTypeID
	,MONTH(CreatedDateTime) as DateMonth
	,a.Amount	
from 
	DSTransaction a
	left join DSItem b on b.ID = a.DSItemID
	left join DSItemSub c on c.ID = a.DSItemSubID
	left join DSItem bb on bb.ID = c.DSItemID
where 
	a.DSTypeID in (1) 
	and YEAR(CreatedDateTime) = 2023 
	--and MONTH(CreatedDateTime) in (1,2,3)
) final
--group by final.DateMonth, final.DSTypeID
order by DateMonth