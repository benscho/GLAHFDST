#A nifty python tool for adding new queries to search json
import json, time

#accept & validate user input (name, URLs, etc.)
label = raw_input("What would you like to name this entry?")
i = 0
URL[i] = raw_input("What is the URL for this option?")
while(true)
	moreURL = raw_input("Would you like this query to access more data sets? y/n")
	if(moreURL == "y")
		URL[++i] = raw_input("What is the URL for this option?")
	else
		break

#run queries on server (timed)
startTime = time.time()

endTime = time.time()

#if servers are slow to respond (>10s?), save data for canning

#add it to the relevant json files